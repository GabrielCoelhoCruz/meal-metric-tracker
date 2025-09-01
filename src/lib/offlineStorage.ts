// IndexedDB wrapper for offline storage
export interface OfflineRecord {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
}

class OfflineStorage {
  private dbName = 'MealTrackerOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store for cached data
        if (!db.objectStoreNames.contains('cachedData')) {
          const cachedStore = db.createObjectStore('cachedData', { keyPath: 'id' });
          cachedStore.createIndex('table', 'table', { unique: false });
          cachedStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
        }

        // Store for pending sync operations
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('table', 'table', { unique: false });
          syncStore.createIndex('synced', 'synced', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for app metadata
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  async storeData(table: string, data: any[]): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cachedData'], 'readwrite');
    const store = transaction.objectStore('cachedData');

    for (const item of data) {
      await store.put({
        id: `${table}_${item.id}`,
        table,
        data: item,
        lastUpdated: Date.now()
      });
    }
  }

  async getData(table: string): Promise<any[]> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cachedData'], 'readonly');
    const store = transaction.objectStore('cachedData');
    const index = store.index('table');

    return new Promise((resolve, reject) => {
      const request = index.getAll(table);
      request.onsuccess = () => {
        const results = request.result.map(item => item.data);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addToSyncQueue(operation: OfflineRecord['operation'], table: string, data: any): Promise<void> {
    if (!this.db) await this.init();

    const record: OfflineRecord = {
      id: `${Date.now()}_${Math.random()}`,
      table,
      operation,
      data,
      timestamp: Date.now(),
      synced: false
    };

    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.add(record);
  }

  async getPendingSyncOperations(): Promise<OfflineRecord[]> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    const index = store.index('synced');

    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markSyncOperationComplete(operationId: string): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    const getRequest = store.get(operationId);
    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (record) {
        record.synced = true;
        store.put(record);
      }
    };
  }

  async clearSyncedOperations(): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const index = store.index('synced');

    const request = index.getAll(IDBKeyRange.only(true));
    request.onsuccess = () => {
      const syncedRecords = request.result;
      syncedRecords.forEach(record => {
        store.delete(record.id);
      });
    };
  }

  async setMetadata(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['metadata'], 'readwrite');
    const store = transaction.objectStore('metadata');
    await store.put({ key, value });
  }

  async getMetadata(key: string): Promise<any> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['metadata'], 'readonly');
    const store = transaction.objectStore('metadata');

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();