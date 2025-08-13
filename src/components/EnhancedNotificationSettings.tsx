import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEnhancedNotifications } from "@/hooks/useEnhancedNotifications";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  BellOff, 
  Clock, 
  Droplets, 
  Calendar, 
  Moon, 
  Wifi, 
  WifiOff, 
  TestTube,
  PauseCircle,
  MoreHorizontal
} from "lucide-react";

export const EnhancedNotificationSettings = () => {
  const { 
    permission, 
    settings, 
    isSupported, 
    connectionStatus,
    lastNotificationSent,
    requestPermission, 
    updateSettings,
    snoozeNotifications,
    isInQuietHours
  } = useEnhancedNotifications();
  
  const { toast } = useToast();

  const handlePermissionRequest = async () => {
    const granted = await requestPermission();
    
    if (!granted) {
      toast({
        title: "Permissão Negada",
        description: "Para receber notificações, ative-as nas configurações do navegador.",
        variant: "destructive"
      });
    }
  };

  const testNotification = () => {
    if (permission !== 'granted') {
      toast({
        title: "Permissão Necessária",
        description: "Ative as notificações primeiro para testar.",
        variant: "destructive"
      });
      return;
    }

    if (settings.muteUntil && Date.now() < (settings.muteUntil || 0)) {
      toast({
        title: "😴 Notificações pausadas",
        description: `Retornam em ${new Date(settings.muteUntil!).toLocaleTimeString()}`,
      });
      return;
    }

    // Test immediate notification
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: { 
          title: '🎯 Teste realizado!', 
          body: 'Sistema de notificações funcionando perfeitamente.',
          tag: `test-${Date.now()}`
        }
      });
    } else {
      new Notification('🎯 Teste realizado!', { 
        body: 'Sistema de notificações funcionando perfeitamente.',
        tag: `test-${Date.now()}`,
        icon: '/pwa-192x192.png'
      });
    }

    toast({
      title: "✅ Teste enviado",
      description: "Verifique se a notificação apareceu no seu dispositivo.",
      duration: 3000,
    });
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="outline" className="flex items-center gap-1"><Wifi className="h-3 w-3" />Conectado</Badge>;
      case 'disconnected':
        return <Badge variant="destructive" className="flex items-center gap-1"><WifiOff className="h-3 w-3" />Desconectado</Badge>;
      case 'testing':
        return <Badge variant="secondary" className="flex items-center gap-1"><TestTube className="h-3 w-3" />Testando...</Badge>;
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações Não Suportadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Seu navegador não suporta notificações. Para receber lembretes, use um navegador mais recente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status e Controles Principais */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Sistema de Notificações
            </div>
            {permission === 'granted' && getConnectionStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission === 'granted' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-success">
                <Bell className="h-4 w-4" />
                <span>Notificações ativas</span>
                {isInQuietHours() && (
                  <Badge variant="secondary" className="ml-2">
                    <Moon className="h-3 w-3 mr-1" />Horário silencioso
                  </Badge>
                )}
              </div>

              {lastNotificationSent && (
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Último envio:</p>
                  <p className="text-sm font-medium">{lastNotificationSent.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(lastNotificationSent.time).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={testNotification} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  🧪 Teste Rápido
                </Button>
                <Button 
                  onClick={() => snoozeNotifications()} 
                  variant="secondary" 
                  size="sm"
                  className="w-full"
                >
                  😴 Soneca ({settings.snoozeMinutes}min)
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BellOff className="h-4 w-4" />
                <span>Notificações desativadas</span>
              </div>
              <Button onClick={handlePermissionRequest} className="w-full">
                Ativar Notificações
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {permission === 'granted' && (
        <>
          {/* Controles de Silêncio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PauseCircle className="h-5 w-5" />
                Controle de Silêncio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mute temporário */}
              <div>
                <Label className="text-base font-medium">Pausar temporariamente</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {settings.muteUntil && Date.now() < (settings.muteUntil || 0)
                    ? `Pausado até ${new Date(settings.muteUntil!).toLocaleString()}`
                    : 'Pausa todos os lembretes por um período específico'}
                </p>
                
                {settings.muteUntil && Date.now() < (settings.muteUntil || 0) ? (
                  <Button size="sm" variant="outline" onClick={() => updateSettings({ muteUntil: null })}>
                    ⏰ Reativar agora
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm" onClick={() => updateSettings({ muteUntil: Date.now() + 30 * 60 * 1000 })}>
                      30min
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => updateSettings({ muteUntil: Date.now() + 2 * 60 * 60 * 1000 })}>
                      2h
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => updateSettings({ muteUntil: Date.now() + 8 * 60 * 60 * 1000 })}>
                      8h
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(8, 0, 0, 0);
                      updateSettings({ muteUntil: tomorrow.getTime() });
                    }}>
                      Até 8h
                    </Button>
                  </div>
                )}
              </div>

              {/* Horário silencioso */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-base font-medium">Horário silencioso</Label>
                    <p className="text-sm text-muted-foreground">
                      Período sem notificações (ex: durante o sono)
                    </p>
                  </div>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(enabled) => updateSettings({ 
                      quietHours: { ...settings.quietHours, enabled } 
                    })}
                  />
                </div>

                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="quiet-start">Início</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => updateSettings({
                          quietHours: { ...settings.quietHours, start: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end">Fim</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => updateSettings({
                          quietHours: { ...settings.quietHours, end: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Soneca rápida */}
              <div className="border-t pt-4">
                <Label className="text-base font-medium">Duração da soneca</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Tempo padrão quando usar "Soneca" nos controles rápidos
                </p>
                <Select
                  value={settings.snoozeMinutes.toString()}
                  onValueChange={(value) => updateSettings({ snoozeMinutes: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sincronização com Refeições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Lembretes de Refeições
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="meal-reminders">Ativar lembretes de refeições</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba avisos nos horários das suas refeições
                  </p>
                </div>
                <Switch
                  id="meal-reminders"
                  checked={settings.mealReminders}
                  onCheckedChange={(checked) => updateSettings({ mealReminders: checked })}
                />
              </div>

              {settings.mealReminders && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sync-supabase">Sincronizar com plano</Label>
                      <p className="text-sm text-muted-foreground">
                        Usar horários do seu plano alimentar atual
                      </p>
                    </div>
                    <Switch
                      id="sync-supabase"
                      checked={settings.useSupabaseMealTimes}
                      onCheckedChange={(checked) => updateSettings({ useSupabaseMealTimes: checked })}
                    />
                  </div>

                  {settings.useSupabaseMealTimes ? (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Horários sincronizados:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(settings.mealTimes).map(([key, time]) => (
                          <div key={key} className="flex justify-between items-center text-sm">
                            <span className="capitalize">
                              {key.replace(/_/g, ' ').replace(/meal (\d+)/, 'Refeição $1')}
                            </span>
                            <Badge variant="outline" className="font-mono text-xs">
                              {time}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="breakfast-time">Café da Manhã</Label>
                        <Input
                          id="breakfast-time"
                          type="time"
                          value={settings.mealTimes.breakfast || '08:00'}
                          onChange={(e) => updateSettings({
                            mealTimes: { ...settings.mealTimes, breakfast: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lunch-time">Almoço</Label>
                        <Input
                          id="lunch-time"
                          type="time"
                          value={settings.mealTimes.lunch || '12:00'}
                          onChange={(e) => updateSettings({
                            mealTimes: { ...settings.mealTimes, lunch: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="snack-time">Lanche</Label>
                        <Input
                          id="snack-time"
                          type="time"
                          value={settings.mealTimes.snack || '15:00'}
                          onChange={(e) => updateSettings({
                            mealTimes: { ...settings.mealTimes, snack: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dinner-time">Jantar</Label>
                        <Input
                          id="dinner-time"
                          type="time"
                          value={settings.mealTimes.dinner || '19:00'}
                          onChange={(e) => updateSettings({
                            mealTimes: { ...settings.mealTimes, dinner: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hidratação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Lembretes de Hidratação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hydration-reminders">Ativar lembretes de hidratação</Label>
                  <p className="text-sm text-muted-foreground">
                    Mantenha-se hidratado com lembretes regulares
                  </p>
                </div>
                <Switch
                  id="hydration-reminders"
                  checked={settings.hydrationReminders}
                  onCheckedChange={(checked) => updateSettings({ hydrationReminders: checked })}
                />
              </div>

              {settings.hydrationReminders && (
                <div>
                  <Label htmlFor="hydration-interval">Intervalo entre lembretes</Label>
                  <Select
                    value={settings.hydrationInterval.toString()}
                    onValueChange={(value) => updateSettings({ hydrationInterval: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">A cada 1 hora</SelectItem>
                      <SelectItem value="2">A cada 2 horas</SelectItem>
                      <SelectItem value="3">A cada 3 horas</SelectItem>
                      <SelectItem value="4">A cada 4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};