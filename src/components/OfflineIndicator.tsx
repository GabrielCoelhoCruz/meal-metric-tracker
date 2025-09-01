import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { syncStatus, manualSync } = useOfflineSync();
  const [isVisible, setIsVisible] = useState(false);

  // Show indicator when offline or when there are pending operations
  useEffect(() => {
    const shouldShow = !syncStatus.isOnline || syncStatus.pendingOperations > 0 || syncStatus.isSyncing;
    setIsVisible(shouldShow);
  }, [syncStatus]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
      "bg-card border border-border rounded-lg shadow-lg p-3",
      "flex items-center gap-2 min-w-[280px]",
      "transition-all duration-300 ease-in-out"
    )}>
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {syncStatus.isSyncing ? (
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
        ) : syncStatus.isOnline ? (
          <Wifi className="w-4 h-4 text-success" />
        ) : (
          <WifiOff className="w-4 h-4 text-destructive" />
        )}
      </div>

      {/* Status Text */}
      <div className="flex-1 min-w-0">
        {syncStatus.isSyncing ? (
          <p className="text-sm font-medium text-foreground">Sincronizando...</p>
        ) : syncStatus.isOnline ? (
          <p className="text-sm text-foreground">
            Online
            {syncStatus.lastSyncTime && (
              <span className="text-muted-foreground ml-1">
                • Última sync: {syncStatus.lastSyncTime.toLocaleTimeString()}
              </span>
            )}
          </p>
        ) : (
          <p className="text-sm font-medium text-destructive">Offline</p>
        )}
        
        {syncStatus.pendingOperations > 0 && (
          <p className="text-xs text-muted-foreground">
            {syncStatus.pendingOperations} operação(ões) pendente(s)
          </p>
        )}
      </div>

      {/* Pending Operations Badge */}
      {syncStatus.pendingOperations > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {syncStatus.pendingOperations}
        </Badge>
      )}

      {/* Conflicts Warning */}
      {syncStatus.hasConflicts && (
        <AlertCircle className="w-4 h-4 text-warning" />
      )}

      {/* Manual Sync Button */}
      {syncStatus.isOnline && syncStatus.pendingOperations > 0 && !syncStatus.isSyncing && (
        <Button
          variant="outline"
          size="sm"
          onClick={manualSync}
          className="flex-shrink-0"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Sync
        </Button>
      )}
    </div>
  );
}