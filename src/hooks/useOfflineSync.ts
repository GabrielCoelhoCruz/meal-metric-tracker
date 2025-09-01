import { useState, useEffect, useCallback } from 'react';
import { offlineStorage, OfflineRecord } from '@/lib/offlineStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  lastSyncTime: Date | null;
  hasConflicts: boolean;
}

export function useOfflineSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingOperations: 0,
    lastSyncTime: null,
    hasConflicts: false
  });

  // Initialize offline storage
  useEffect(() => {
    offlineStorage.init().catch(console.error);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      triggerSync();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast.info('Você está offline. As alterações serão sincronizadas quando a conexão for restaurada.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check pending operations count
  const updatePendingCount = useCallback(async () => {
    try {
      const pending = await offlineStorage.getPendingSyncOperations();
      setSyncStatus(prev => ({ ...prev, pendingOperations: pending.length }));
    } catch (error) {
      console.error('Error checking pending operations:', error);
      // Set to 0 on error to prevent infinite error loops
      setSyncStatus(prev => ({ ...prev, pendingOperations: 0 }));
    }
  }, []);

  useEffect(() => {
    updatePendingCount();
    const interval = setInterval(updatePendingCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [updatePendingCount]);

  // Cache data for offline use
  const cacheData = useCallback(async (table: string, data: any[]) => {
    try {
      await offlineStorage.storeData(table, data);
    } catch (error) {
      console.error(`Error caching ${table} data:`, error);
    }
  }, []);

  // Get cached data when offline
  const getCachedData = useCallback(async (table: string) => {
    try {
      return await offlineStorage.getData(table);
    } catch (error) {
      console.error(`Error getting cached ${table} data:`, error);
      return [];
    }
  }, []);

  // Add operation to sync queue
  const queueOperation = useCallback(async (operation: OfflineRecord['operation'], table: string, data: any) => {
    try {
      await offlineStorage.addToSyncQueue(operation, table, data);
      await updatePendingCount();
      
      if (!syncStatus.isOnline) {
        toast.info('Alteração salva offline. Será sincronizada quando a conexão for restaurada.');
      }
    } catch (error) {
      console.error('Error queuing operation:', error);
      toast.error('Erro ao salvar alteração offline');
    }
  }, [syncStatus.isOnline, updatePendingCount]);

  // Sync pending operations
  const syncOperations = useCallback(async (operations: OfflineRecord[]) => {
    const results = {
      successful: 0,
      failed: 0,
      conflicts: 0
    };

    for (const operation of operations) {
      try {
        let success = false;

        switch (operation.table) {
          case 'daily_plans':
            success = await syncDailyPlanOperation(operation);
            break;
          case 'meals':
            success = await syncMealOperation(operation);
            break;
          case 'meal_foods':
            success = await syncMealFoodOperation(operation);
            break;
          default:
            console.warn(`Unknown table for sync: ${operation.table}`);
        }

        if (success) {
          await offlineStorage.markSyncOperationComplete(operation.id);
          results.successful++;
        } else {
          results.failed++;
        }
      } catch (error) {
        console.error(`Error syncing operation ${operation.id}:`, error);
        results.failed++;
      }
    }

    return results;
  }, []);

  // Specific sync operations for each table
  const syncDailyPlanOperation = async (operation: OfflineRecord): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('daily_plans')
        .upsert(operation.data);
      
      return !error;
    } catch (error) {
      console.error('Error syncing daily plan:', error);
      return false;
    }
  };

  const syncMealOperation = async (operation: OfflineRecord): Promise<boolean> => {
    try {
      let result;
      
      switch (operation.operation) {
        case 'insert':
        case 'update':
          result = await supabase
            .from('meals')
            .upsert(operation.data);
          break;
        case 'delete':
          result = await supabase
            .from('meals')
            .delete()
            .eq('id', operation.data.id);
          break;
      }
      
      return !result.error;
    } catch (error) {
      console.error('Error syncing meal:', error);
      return false;
    }
  };

  const syncMealFoodOperation = async (operation: OfflineRecord): Promise<boolean> => {
    try {
      let result;
      
      switch (operation.operation) {
        case 'insert':
        case 'update':
          result = await supabase
            .from('meal_foods')
            .upsert(operation.data);
          break;
        case 'delete':
          result = await supabase
            .from('meal_foods')
            .delete()
            .eq('id', operation.data.id);
          break;
      }
      
      return !result.error;
    } catch (error) {
      console.error('Error syncing meal food:', error);
      return false;
    }
  };

  // Main sync trigger
  const triggerSync = useCallback(async () => {
    if (!syncStatus.isOnline || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const pendingOperations = await offlineStorage.getPendingSyncOperations();
      
      if (pendingOperations.length === 0) {
        setSyncStatus(prev => ({ 
          ...prev, 
          isSyncing: false,
          lastSyncTime: new Date()
        }));
        return;
      }

      // Sort operations by timestamp to maintain order
      const sortedOperations = pendingOperations.sort((a, b) => a.timestamp - b.timestamp);
      
      const results = await syncOperations(sortedOperations);
      
      // Clean up synced operations
      await offlineStorage.clearSyncedOperations();
      
      // Update status
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        hasConflicts: results.conflicts > 0
      }));

      await updatePendingCount();

      // Show sync results
      if (results.successful > 0) {
        toast.success(`${results.successful} alterações sincronizadas com sucesso`);
      }
      
      if (results.failed > 0) {
        toast.error(`${results.failed} alterações falharam na sincronização`);
      }

    } catch (error) {
      console.error('Error during sync:', error);
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      toast.error('Erro durante a sincronização');
    }
  }, [syncStatus.isOnline, syncStatus.isSyncing, syncOperations, updatePendingCount]);

  // Manual sync trigger
  const manualSync = useCallback(async () => {
    if (syncStatus.isOnline) {
      await triggerSync();
    } else {
      toast.warning('Sincronização não disponível offline');
    }
  }, [syncStatus.isOnline, triggerSync]);

  return {
    syncStatus,
    cacheData,
    getCachedData,
    queueOperation,
    triggerSync,
    manualSync
  };
}