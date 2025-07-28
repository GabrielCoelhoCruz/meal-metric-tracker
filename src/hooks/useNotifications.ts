import { useState, useEffect, useCallback } from 'react';

export interface NotificationSettings {
  mealReminders: boolean;
  hydrationReminders: boolean;
  planningReminders: boolean;
  educationalTips: boolean;
  mealTimes: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  hydrationInterval: number; // in hours
}

const defaultSettings: NotificationSettings = {
  mealReminders: true,
  hydrationReminders: true,
  planningReminders: true,
  educationalTips: true,
  mealTimes: {
    breakfast: '08:00',
    lunch: '12:00',
    snack: '15:00',
    dinner: '19:00'
  },
  hydrationInterval: 2
};

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [isSupported]);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    
    // Reschedule notifications with new settings
    scheduleAllNotifications(updatedSettings);
  }, [settings]);

  const scheduleNotification = useCallback((title: string, body: string, tag: string, scheduledTime: Date) => {
    if (permission !== 'granted' || !isSupported) return;

    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) return; // Don't schedule past notifications

    setTimeout(() => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: { title, body, tag }
        });
      } else {
        // Fallback to regular notification
        new Notification(title, { body, tag });
      }
    }, delay);
  }, [permission, isSupported]);

  const scheduleMealReminders = useCallback((mealSettings: NotificationSettings['mealTimes']) => {
    if (!settings.mealReminders) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const meals = [
      { key: 'breakfast', name: 'Café da Manhã', time: mealSettings.breakfast },
      { key: 'lunch', name: 'Almoço', time: mealSettings.lunch },
      { key: 'snack', name: 'Lanche', time: mealSettings.snack },
      { key: 'dinner', name: 'Jantar', time: mealSettings.dinner }
    ];

    meals.forEach(meal => {
      const [hours, minutes] = meal.time.split(':').map(Number);
      
      // Schedule for today if time hasn't passed
      const todayTime = new Date(today);
      todayTime.setHours(hours, minutes, 0, 0);
      
      if (todayTime > new Date()) {
        scheduleNotification(
          `${meal.name} - Hora da Refeição!`,
          `Está na hora do seu ${meal.name.toLowerCase()}. Vamos manter sua dieta em dia!`,
          `meal-${meal.key}-${todayTime.getTime()}`,
          todayTime
        );
      }

      // Schedule for tomorrow
      const tomorrowTime = new Date(tomorrow);
      tomorrowTime.setHours(hours, minutes, 0, 0);
      
      scheduleNotification(
        `${meal.name} - Hora da Refeição!`,
        `Está na hora do seu ${meal.name.toLowerCase()}. Vamos manter sua dieta em dia!`,
        `meal-${meal.key}-${tomorrowTime.getTime()}`,
        tomorrowTime
      );
    });
  }, [settings.mealReminders, scheduleNotification]);

  const scheduleHydrationReminders = useCallback(() => {
    if (!settings.hydrationReminders) return;

    const interval = settings.hydrationInterval * 60 * 60 * 1000; // Convert hours to milliseconds
    const startTime = new Date();
    startTime.setMinutes(0, 0, 0); // Start at the top of the hour

    // Schedule for the next 24 hours
    for (let i = 1; i <= 12; i++) {
      const reminderTime = new Date(startTime.getTime() + (interval * i));
      
      scheduleNotification(
        'Hora de se Hidratar! 💧',
        'Que tal beber um copo de água? Manter-se hidratado é fundamental para sua saúde!',
        `hydration-${reminderTime.getTime()}`,
        reminderTime
      );
    }
  }, [settings.hydrationReminders, settings.hydrationInterval, scheduleNotification]);

  const schedulePlanningReminders = useCallback(() => {
    if (!settings.planningReminders) return;

    const now = new Date();
    
    // Weekly meal planning reminder (Sundays at 9 AM)
    const nextSunday = new Date(now);
    const daysUntilSunday = (7 - now.getDay()) % 7;
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(9, 0, 0, 0);

    if (nextSunday <= now) {
      nextSunday.setDate(nextSunday.getDate() + 7);
    }

    scheduleNotification(
      'Planejamento Semanal 📋',
      'Hora de planejar suas refeições da semana! Organize sua dieta com antecedência.',
      `planning-weekly-${nextSunday.getTime()}`,
      nextSunday
    );

    // Daily prep reminder (night before, 8 PM)
    const tonight = new Date(now);
    tonight.setHours(20, 0, 0, 0);
    
    if (tonight <= now) {
      tonight.setDate(tonight.getDate() + 1);
    }

    scheduleNotification(
      'Preparação para Amanhã 🍽️',
      'Que tal preparar algo para suas refeições de amanhã? A preparação é chave do sucesso!',
      `planning-daily-${tonight.getTime()}`,
      tonight
    );
  }, [settings.planningReminders, scheduleNotification]);

  const scheduleEducationalTips = useCallback(() => {
    if (!settings.educationalTips) return;

    const tips = [
      'Comer devagar ajuda na digestão e na sensação de saciedade.',
      'Incluir proteína em cada refeição ajuda a manter a massa muscular.',
      'Beber água antes das refeições pode ajudar no controle de porções.',
      'Mastigar bem os alimentos melhora a absorção de nutrientes.',
      'Fazer refeições regulares ajuda a manter o metabolismo ativo.',
      'Incluir fibras na dieta ajuda na saúde intestinal.',
      'Variar as cores dos alimentos garante diferentes nutrientes.'
    ];

    // Schedule one tip every 3 days
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const tipTime = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000 * i));
      tipTime.setHours(14, 0, 0, 0); // 2 PM

      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      scheduleNotification(
        'Dica de Nutrição 💡',
        randomTip,
        `tip-${tipTime.getTime()}`,
        tipTime
      );
    }
  }, [settings.educationalTips, scheduleNotification]);

  const scheduleAllNotifications = useCallback((currentSettings: NotificationSettings) => {
    if (permission !== 'granted') return;

    // Clear existing scheduled notifications by reloading the service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_NOTIFICATIONS'
      });
    }

    scheduleMealReminders(currentSettings.mealTimes);
    scheduleHydrationReminders();
    schedulePlanningReminders();
    scheduleEducationalTips();
  }, [permission, scheduleMealReminders, scheduleHydrationReminders, schedulePlanningReminders, scheduleEducationalTips]);

  // Schedule notifications when permission is granted
  useEffect(() => {
    if (permission === 'granted') {
      scheduleAllNotifications(settings);
    }
  }, [permission, scheduleAllNotifications, settings]);

  return {
    permission,
    settings,
    isSupported,
    requestPermission,
    updateSettings,
    scheduleAllNotifications: () => scheduleAllNotifications(settings)
  };
};