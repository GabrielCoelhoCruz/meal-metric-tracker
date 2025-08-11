import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Clock, Droplets, Calendar, BookOpen } from "lucide-react";

export const NotificationSettings = () => {
  const { permission, settings, isSupported, requestPermission, updateSettings } = useNotifications();
  const { toast } = useToast();

  const handlePermissionRequest = async () => {
    const granted = await requestPermission();
    
    if (granted) {
      toast({
        title: "Notificações Ativadas!",
        description: "Você receberá lembretes para suas refeições e hidratação.",
      });
    } else {
      toast({
        title: "Permissão Negada",
        description: "Para receber notificações, ative-as nas configurações do navegador.",
        variant: "destructive"
      });
    }
  };

  const handleMealTimeChange = (meal: string, time: string) => {
    updateSettings({
      mealTimes: {
        ...settings.mealTimes,
        [meal]: time
      }
    });
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

    // Test immediate notification
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: { 
          title: '🍽️ Teste de Notificação!', 
          body: 'Perfeito! As notificações estão funcionando no seu dispositivo.',
          tag: `test-${Date.now()}`
        }
      });
    } else {
      // Fallback to regular notification
      new Notification('🍽️ Teste de Notificação!', { 
        body: 'Perfeito! As notificações estão funcionando no seu dispositivo.',
        tag: `test-${Date.now()}`,
        icon: '/pwa-192x192.png'
      });
    }

    toast({
      title: "Notificação de Teste Enviada!",
      description: "Verifique se apareceu uma notificação no seu dispositivo.",
    });
  };

  const testScheduledNotification = () => {
    if (permission !== 'granted') {
      toast({
        title: "Permissão Necessária",
        description: "Ative as notificações primeiro para testar.",
        variant: "destructive"
      });
      return;
    }

    // Schedule a test notification for 5 seconds from now
    const testTime = new Date();
    testTime.setSeconds(testTime.getSeconds() + 5);

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: { 
          title: '⏰ Teste de Lembrete!', 
          body: 'Esta é uma simulação de como você receberá os lembretes das refeições.',
          tag: `scheduled-test-${Date.now()}`
        }
      });
    } else {
      // Use setTimeout for fallback
      setTimeout(() => {
        new Notification('⏰ Teste de Lembrete!', { 
          body: 'Esta é uma simulação de como você receberá os lembretes das refeições.',
          tag: `scheduled-test-${Date.now()}`,
          icon: '/pwa-192x192.png'
        });
      }, 5000);
    }

    toast({
      title: "Lembrete Programado!",
      description: "Você receberá uma notificação em 5 segundos.",
    });
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
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Status das Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission === 'granted' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-success">
                <Bell className="h-4 w-4" />
                <span>Notificações ativadas</span>
              </div>
              <Button 
                onClick={testNotification} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                🧪 Testar Notificação
              </Button>
              <Button 
                onClick={testScheduledNotification} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                ⏰ Testar Lembrete (5s)
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BellOff className="h-4 w-4" />
                <span>Notificações desativadas</span>
              </div>
              <Button onClick={handlePermissionRequest} variant="outline">
                Ativar Notificações
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {permission === 'granted' && (
        <>
          {/* Sync with Supabase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Sincronização com Refeições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sync-supabase">Usar horários das refeições do plano</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar automaticamente com os horários configurados nas suas refeições
                  </p>
                </div>
                <Switch
                  id="sync-supabase"
                  checked={settings.useSupabaseMealTimes}
                  onCheckedChange={(checked) => updateSettings({ useSupabaseMealTimes: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Meal Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Lembretes de Refeições
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="meal-reminders">Ativar lembretes de refeições</Label>
                <Switch
                  id="meal-reminders"
                  checked={settings.mealReminders}
                  onCheckedChange={(checked) => updateSettings({ mealReminders: checked })}
                />
              </div>

              {settings.mealReminders && (
                <div className="space-y-4">
                  {settings.useSupabaseMealTimes ? (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Horários sincronizados com suas refeições:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(settings.mealTimes).map(([key, time]) => (
                          <div key={key} className="flex justify-between items-center text-sm">
                            <span className="capitalize">
                              {key.replace(/_/g, ' ').replace(/meal (\d+)/, 'Refeição $1')}
                            </span>
                            <span className="font-mono">{time}</span>
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
                          onChange={(e) => handleMealTimeChange('breakfast', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lunch-time">Almoço</Label>
                        <Input
                          id="lunch-time"
                          type="time"
                          value={settings.mealTimes.lunch || '12:00'}
                          onChange={(e) => handleMealTimeChange('lunch', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="snack-time">Lanche</Label>
                        <Input
                          id="snack-time"
                          type="time"
                          value={settings.mealTimes.snack || '15:00'}
                          onChange={(e) => handleMealTimeChange('snack', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dinner-time">Jantar</Label>
                        <Input
                          id="dinner-time"
                          type="time"
                          value={settings.mealTimes.dinner || '19:00'}
                          onChange={(e) => handleMealTimeChange('dinner', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hydration Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Lembretes de Hidratação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hydration-reminders">Ativar lembretes de hidratação</Label>
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

          {/* Planning Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lembretes de Planejamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="planning-reminders">Ativar lembretes de planejamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Lembretes semanais para planejar refeições e preparação diária
                  </p>
                </div>
                <Switch
                  id="planning-reminders"
                  checked={settings.planningReminders}
                  onCheckedChange={(checked) => updateSettings({ planningReminders: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Educational Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Dicas Educacionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="educational-tips">Receber dicas de nutrição</Label>
                  <p className="text-sm text-muted-foreground">
                    Dicas periódicas sobre alimentação saudável e hábitos
                  </p>
                </div>
                <Switch
                  id="educational-tips"
                  checked={settings.educationalTips}
                  onCheckedChange={(checked) => updateSettings({ educationalTips: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};