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
        <CardContent>
          {permission === 'granted' ? (
            <div className="flex items-center gap-2 text-green-600">
              <Bell className="h-4 w-4" />
              <span>Notificações ativadas</span>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="breakfast-time">Café da Manhã</Label>
                    <Input
                      id="breakfast-time"
                      type="time"
                      value={settings.mealTimes.breakfast}
                      onChange={(e) => handleMealTimeChange('breakfast', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lunch-time">Almoço</Label>
                    <Input
                      id="lunch-time"
                      type="time"
                      value={settings.mealTimes.lunch}
                      onChange={(e) => handleMealTimeChange('lunch', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="snack-time">Lanche</Label>
                    <Input
                      id="snack-time"
                      type="time"
                      value={settings.mealTimes.snack}
                      onChange={(e) => handleMealTimeChange('snack', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dinner-time">Jantar</Label>
                    <Input
                      id="dinner-time"
                      type="time"
                      value={settings.mealTimes.dinner}
                      onChange={(e) => handleMealTimeChange('dinner', e.target.value)}
                    />
                  </div>
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