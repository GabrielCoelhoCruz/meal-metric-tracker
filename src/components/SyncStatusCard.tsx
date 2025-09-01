import { RefreshCw, Wifi, WifiOff, Check, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { LoadingButton } from '@/components/LoadingButton';

export function SyncStatusCard() {
  const { syncStatus, manualSync } = useOfflineSync();

  const getStatusColor = () => {
    if (syncStatus.isSyncing) return 'text-primary';
    if (!syncStatus.isOnline) return 'text-destructive';
    if (syncStatus.pendingOperations > 0) return 'text-warning';
    return 'text-success';
  };

  const getStatusIcon = () => {
    if (syncStatus.isSyncing) return <RefreshCw className="w-5 h-5 animate-spin" />;
    if (!syncStatus.isOnline) return <WifiOff className="w-5 h-5" />;
    if (syncStatus.pendingOperations > 0) return <Clock className="w-5 h-5" />;
    return <Check className="w-5 h-5" />;
  };

  const getStatusText = () => {
    if (syncStatus.isSyncing) return 'Sincronizando dados...';
    if (!syncStatus.isOnline) return 'Modo offline';
    if (syncStatus.pendingOperations > 0) return 'Sincronização pendente';
    return 'Totalmente sincronizado';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={getStatusColor()}>
            {getStatusIcon()}
          </span>
          Status de Sincronização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Description */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{getStatusText()}</p>
          {syncStatus.lastSyncTime && (
            <p className="text-xs text-muted-foreground">
              Última sincronização: {syncStatus.lastSyncTime.toLocaleString()}
            </p>
          )}
        </div>

        {/* Pending Operations */}
        {syncStatus.pendingOperations > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm">Operações pendentes</span>
            </div>
            <Badge variant="secondary">
              {syncStatus.pendingOperations}
            </Badge>
          </div>
        )}

        {/* Conflicts Warning */}
        {syncStatus.hasConflicts && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">
              Conflitos de sincronização detectados
            </span>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
            <span className="text-sm">
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Manual Sync Button */}
          {syncStatus.isOnline && (
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={manualSync}
              loading={syncStatus.isSyncing}
              loadingText="Sincronizando..."
              disabled={syncStatus.pendingOperations === 0}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Sincronizar
            </LoadingButton>
          )}
        </div>

        {/* Offline Notice */}
        {!syncStatus.isOnline && (
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
            <p>Você está trabalhando offline. Suas alterações serão automaticamente sincronizadas quando a conexão for restaurada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}