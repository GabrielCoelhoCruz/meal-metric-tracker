import { useState, useEffect, useCallback } from 'react';
import { useDiet } from '@/contexts/DietContext';

export interface NotificationSettings {
  mealReminders: boolean;
  hydrationReminders: boolean;
  planningReminders: boolean;
  educationalTips: boolean;
  mealTimes: {
    [key: string]: string; // Dynamic meal times from Supabase
  };
  hydrationInterval: number; // in hours
  useSupabaseMealTimes: boolean; // New option to sync with Supabase
  muteUntil?: number | null; // timestamp (ms) when mute ends
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
  hydrationInterval: 2,
  useSupabaseMealTimes: true,
  muteUntil: null
};

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isSupported, setIsSupported] = useState(false);
  const { currentDayPlan } = useDiet();

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

  // Sync meal times from Supabase when data is loaded
  useEffect(() => {
    if (currentDayPlan && settings.useSupabaseMealTimes) {
      const supabaseMealTimes: { [key: string]: string } = {};
      
      currentDayPlan.meals.forEach((meal, index) => {
        // Create a key based on meal name or index
        const key = meal.name.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w]/g, '')
          .replace(/refeicao_?(\d+)/, 'meal_$1') || `meal_${index + 1}`;
        
        supabaseMealTimes[key] = meal.scheduledTime;
      });

      // Update settings with Supabase meal times if they differ
      const currentMealTimesStr = JSON.stringify(settings.mealTimes);
      const supabaseMealTimesStr = JSON.stringify(supabaseMealTimes);
      
      if (currentMealTimesStr !== supabaseMealTimesStr && Object.keys(supabaseMealTimes).length > 0) {
        updateSettings({
          mealTimes: { ...settings.mealTimes, ...supabaseMealTimes }
        });
      }
    }
  }, [currentDayPlan, settings.useSupabaseMealTimes]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [isSupported]);



  const scheduleNotification = useCallback((title: string, body: string, tag: string, scheduledTime: Date) => {
    if (permission !== 'granted' || !isSupported) return;

    // Respect mute window
    const muteUntil = settings.muteUntil ?? 0;
    if (muteUntil && Date.now() < muteUntil) return;

    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) return; // Don't schedule past notifications

    setTimeout(() => {
      // Double-check mute at send time
      const currentMute = (settings.muteUntil ?? 0);
      if (currentMute && Date.now() < currentMute) return;

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
  }, [permission, isSupported, settings.muteUntil]);

  const scheduleMealReminders = useCallback((mealSettings: { [key: string]: string }) => {
    if (!settings.mealReminders) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get meal times from settings (could be from Supabase or manual)
    Object.entries(mealSettings).forEach(([mealKey, mealTime]) => {
      if (!mealTime) return;
      
      // Garantir que o tempo está no formato HH:MM (remover segundos se existir)
      const timeFormatted = mealTime.includes(':') ? mealTime.split(':').slice(0, 2).join(':') : mealTime;
      const [hours, minutes] = timeFormatted.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes)) return;

      // Generate meal name based on key
      const mealName = mealKey.replace(/_/g, ' ')
        .replace(/meal (\d+)/, 'Refeição $1')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      // Schedule for today if time hasn't passed
      const todayTime = new Date(today);
      todayTime.setHours(hours, minutes, 0, 0);
      
      if (todayTime > new Date()) {
        scheduleNotification(
          `${mealName} - Hora da Refeição!`,
          `Está na hora da sua ${mealName.toLowerCase()}. Vamos manter sua dieta em dia!`,
          `meal-${mealKey}-${todayTime.getTime()}`,
          todayTime
        );
      }

      // Schedule for tomorrow
      const tomorrowTime = new Date(tomorrow);
      tomorrowTime.setHours(hours, minutes, 0, 0);
      
      scheduleNotification(
        `${mealName} - Hora da Refeição!`,
        `Está na hora da sua ${mealName.toLowerCase()}. Vamos manter sua dieta em dia!`,
        `meal-${mealKey}-${tomorrowTime.getTime()}`,
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

    // Respect mute window
    const muteUntil = currentSettings.muteUntil ?? 0;
    if (muteUntil && Date.now() < muteUntil) {
      // Clear any existing and skip scheduling
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_NOTIFICATIONS' });
        navigator.serviceWorker.controller.postMessage({ type: 'SET_MUTE_UNTIL', payload: { muteUntil } });
      }
      return;
    }

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

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings } as NotificationSettings;
    setSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));

    // Inform SW about mute state
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_MUTE_UNTIL',
        payload: { muteUntil: updatedSettings.muteUntil ?? 0 }
      });
    }

    // Reschedule notifications with new settings
    scheduleAllNotifications(updatedSettings);
  }, [settings, scheduleAllNotifications]);

  return {
    permission,
    settings,
    isSupported,
    requestPermission,
    updateSettings,
    scheduleAllNotifications: () => scheduleAllNotifications(settings)
  };
};