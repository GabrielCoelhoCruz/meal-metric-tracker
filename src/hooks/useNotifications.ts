import { useCallback } from 'react';
import { useDiet } from '@/contexts/DietContext';

// Web notifications API hook
export function useNotifications() {
  const { currentDayPlan } = useDiet();

  // Solicitar permissões de notificação
  const requestPermissions = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Agendar notificações de refeições (simplificado para web)
  const scheduleMealReminders = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    console.log('Meal reminders would be scheduled here');
    // Em uma implementação real, você usaria service workers
    // para notificações em background
  }, [requestPermissions]);

  // Enviar notificação de conquista
  const sendAchievementNotification = useCallback(async (title: string, body: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    new Notification(title, {
      body,
      icon: '/favicon.ico'
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

    new Notification('Lembrete! ⏰', {
      body: message,
      icon: '/favicon.ico'
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
  }, [currentDayPlan, sendGoalNotification]);

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