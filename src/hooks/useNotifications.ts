import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useDiet } from '@/contexts/DietContext';

// Configurar como as notificações devem ser apresentadas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationSchedule {
  identifier: string;
  content: {
    title: string;
    body: string;
    sound?: boolean;
  };
  trigger: {
    hour: number;
    minute: number;
    repeats: boolean;
  };
}

export function useNotifications() {
  const { currentDayPlan } = useDiet();

  // Solicitar permissões de notificação
  const requestPermissions = useCallback(async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }, []);

  // Agendar notificações de refeições
  const scheduleMealReminders = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    // Cancelar todas as notificações existentes
    await Notifications.cancelAllScheduledNotificationsAsync();

    const mealTimes = [
      { time: { hour: 7, minute: 0 }, meal: 'Café da Manhã', emoji: '☕' },
      { time: { hour: 10, minute: 0 }, meal: 'Lanche da Manhã', emoji: '🥨' },
      { time: { hour: 12, minute: 30 }, meal: 'Almoço', emoji: '🍽️' },
      { time: { hour: 15, minute: 30 }, meal: 'Lanche da Tarde', emoji: '🥪' },
      { time: { hour: 19, minute: 0 }, meal: 'Jantar', emoji: '🍽️' },
      { time: { hour: 21, minute: 0 }, meal: 'Ceia', emoji: '🥛' },
    ];

    // Agendar lembretes de refeições
    for (const mealTime of mealTimes) {
      await Notifications.scheduleNotificationAsync({
        identifier: `meal-${mealTime.meal.toLowerCase().replace(' ', '-')}`,
        content: {
          title: `Hora do ${mealTime.meal}! ${mealTime.emoji}`,
          body: `Não esqueça de registrar sua refeição!`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: mealTime.time.hour,
          minute: mealTime.time.minute,
          repeats: true,
        },
      });
    }

    // Agendar lembretes de hidratação
    const hydrationTimes = [9, 11, 14, 16, 18, 20];
    for (const hour of hydrationTimes) {
      await Notifications.scheduleNotificationAsync({
        identifier: `hydration-${hour}`,
        content: {
          title: 'Hora de se hidratar! 💧',
          body: 'Lembre-se de beber água regularmente!',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute: 0,
          repeats: true,
        },
      });
    }
  }, [requestPermissions]);

  // Enviar notificação de conquista
  const sendAchievementNotification = useCallback(async (title: string, body: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      identifier: `achievement-${Date.now()}`,
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Imediata
    });
  }, [requestPermissions]);

  // Enviar notificação de meta atingida
  const sendGoalNotification = useCallback(async () => {
    await sendAchievementNotification(
      'Meta atingida! 🎯',
      'Todas as refeições completas! Parabéns!'
    );
  }, [sendAchievementNotification]);

  // Enviar notificação de streak
  const sendStreakNotification = useCallback(async (days: number) => {
    await sendAchievementNotification(
      `${days} dias seguidos! 🔥`,
      'Você está no fogo! Continue assim!'
    );
  }, [sendAchievementNotification]);

  // Enviar notificação de lembrete
  const sendReminderNotification = useCallback(async (message: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      identifier: `reminder-${Date.now()}`,
      content: {
        title: 'Lembrete! ⏰',
        body: message,
        sound: true,
      },
      trigger: null, // Imediata
    });
  }, [requestPermissions]);

  // Verificar progresso e enviar notificações contextuais
  const checkProgressAndNotify = useCallback(async () => {
    if (!currentDayPlan) return;

    const completedMeals = currentDayPlan.meals.filter(meal => meal.isCompleted).length;

    // Meta diária completa
    if (completedMeals === currentDayPlan.meals.length && currentDayPlan.meals.length > 0) {
      await sendGoalNotification();
    }

    // Progresso próximo ao fim do dia
    const now = new Date();
    const totalFoods = currentDayPlan.meals.reduce((acc, meal) => acc + meal.foods.length, 0);
    const completedFoods = currentDayPlan.meals.reduce((acc, meal) => 
      acc + meal.foods.filter(food => food.isCompleted).length, 0
    );
    const progressPercentage = totalFoods > 0 ? (completedFoods / totalFoods) * 100 : 0;

    if (now.getHours() >= 20 && progressPercentage < 80) {
      await sendReminderNotification('Faltam apenas algumas refeições para completar o dia!');
    }

    // Lembrete de meio dia
    if (now.getHours() === 12 && progressPercentage < 30) {
      await sendReminderNotification('Como está seu dia? Registre suas refeições!');
    }
  }, [currentDayPlan, sendGoalNotification, sendReminderNotification]);

  // Inicializar notificações
  useEffect(() => {
    scheduleMealReminders();
  }, [scheduleMealReminders]);

  return {
    requestPermissions,
    scheduleMealReminders,
    sendAchievementNotification,
    sendGoalNotification,
    sendStreakNotification,
    sendReminderNotification,
    checkProgressAndNotify,
  };
}