import { useState, useEffect, useCallback, useRef } from 'react';
import { useDiet } from '@/contexts/DietContext';
import { useToast } from '@/hooks/use-toast';

// Consolidated notification scheduler with duplicate prevention
class NotificationScheduler {
  private activeNotifications = new Map<string, number>();
  private reconnectionInterval: number | null = null;
  private lastScheduledTime = 0;
  private duplicateThreshold = 60000; // 1 minute

  constructor(private onNotificationSent: (type: string, title: string) => void) {}

  scheduleNotification(
    id: string,
    title: string,
    body: string,
    scheduledTime: Date,
    type: string = 'general'
  ): boolean {
    // Prevent duplicates within threshold
    const now = Date.now();
    if (now - this.lastScheduledTime < this.duplicateThreshold && this.activeNotifications.has(id)) {
      return false;
    }

    const delay = scheduledTime.getTime() - now;
    if (delay <= 0) return false;

    // Clear existing timeout for this ID
    const existingTimeout = this.activeNotifications.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeoutId = window.setTimeout(() => {
      this.sendNotification(title, body, id);
      this.activeNotifications.delete(id);
      this.onNotificationSent(type, title);
    }, delay);

    this.activeNotifications.set(id, timeoutId);
    this.lastScheduledTime = now;
    return true;
  }

  private sendNotification(title: string, body: string, tag: string) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: { title, body, tag }
      });
    } else {
      new Notification(title, { body, tag, icon: '/pwa-192x192.png' });
    }
  }

  clearAll() {
    this.activeNotifications.forEach(timeoutId => clearTimeout(timeoutId));
    this.activeNotifications.clear();
  }

  startReconnectionTest() {
    if (this.reconnectionInterval) return;

    this.reconnectionInterval = window.setInterval(() => {
      // Test service worker connection
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'PING' });
      }
    }, 30000); // Test every 30 seconds
  }

  stopReconnectionTest() {
    if (this.reconnectionInterval) {
      clearInterval(this.reconnectionInterval);
      this.reconnectionInterval = null;
    }
  }
}

export interface EnhancedNotificationSettings {
  mealReminders: boolean;
  hydrationReminders: boolean;
  planningReminders: boolean;
  educationalTips: boolean;
  mealTimes: { [key: string]: string };
  hydrationInterval: number;
  useSupabaseMealTimes: boolean;
  muteUntil?: number | null;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
  };
  snoozeMinutes: number;
}

const defaultSettings: EnhancedNotificationSettings = {
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
  muteUntil: null,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00'
  },
  snoozeMinutes: 10
};

export const useEnhancedNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<EnhancedNotificationSettings>(defaultSettings);
  const [isSupported, setIsSupported] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [lastNotificationSent, setLastNotificationSent] = useState<{ type: string; title: string; time: number } | null>(null);
  
  const { currentDayPlan } = useDiet();
  const { toast } = useToast();
  const schedulerRef = useRef<NotificationScheduler | null>(null);

  // Initialize scheduler
  useEffect(() => {
    if (!schedulerRef.current) {
      schedulerRef.current = new NotificationScheduler((type, title) => {
        setLastNotificationSent({ type, title, time: Date.now() });
        
        // Show subtle feedback toast
        toast({
          title: "📱 Lembrete enviado",
          description: title,
          duration: 2000,
        });
      });
    }

    return () => {
      schedulerRef.current?.clearAll();
      schedulerRef.current?.stopReconnectionTest();
    };
  }, [toast]);

  // Check support and permission
  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load settings
    const savedSettings = localStorage.getItem('enhancedNotificationSettings');
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  // Sync with Supabase meal times
  useEffect(() => {
    if (currentDayPlan && settings.useSupabaseMealTimes) {
      const supabaseMealTimes: { [key: string]: string } = {};
      
      currentDayPlan.meals.forEach((meal, index) => {
        const key = meal.name.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w]/g, '')
          .replace(/refeicao_?(\d+)/, 'meal_$1') || `meal_${index + 1}`;
        
        supabaseMealTimes[key] = meal.scheduledTime;
      });

      if (Object.keys(supabaseMealTimes).length > 0) {
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
    
    if (result === 'granted') {
      schedulerRef.current?.startReconnectionTest();
      toast({
        title: "✅ Notificações ativadas!",
        description: "Você receberá lembretes personalizados",
        duration: 3000,
      });
    }
    
    return result === 'granted';
  }, [isSupported, toast]);

  const isInQuietHours = useCallback((time: Date = new Date()): boolean => {
    if (!settings.quietHours.enabled) return false;

    const currentHour = time.getHours();
    const currentMinute = time.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMin] = settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 to 07:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    return currentTime >= startTime && currentTime <= endTime;
  }, [settings.quietHours]);

  const scheduleNotification = useCallback((
    id: string,
    title: string,
    body: string,
    scheduledTime: Date,
    type: string = 'general'
  ) => {
    if (permission !== 'granted' || !schedulerRef.current) return false;

    // Check mute status
    const muteUntil = settings.muteUntil ?? 0;
    if (muteUntil && Date.now() < muteUntil) return false;

    // Adjust for quiet hours
    const adjustedTime = new Date(scheduledTime);
    if (isInQuietHours(adjustedTime)) {
      // Move to end of quiet hours
      const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);
      adjustedTime.setHours(endHour, endMin, 0, 0);
      
      // If it's the next day, adjust
      if (adjustedTime <= scheduledTime) {
        adjustedTime.setDate(adjustedTime.getDate() + 1);
      }
    }

    return schedulerRef.current.scheduleNotification(id, title, body, adjustedTime, type);
  }, [permission, settings.muteUntil, isInQuietHours, settings.quietHours.end]);

  const snoozeNotifications = useCallback((minutes: number = settings.snoozeMinutes) => {
    const snoozeUntil = Date.now() + minutes * 60 * 1000;
    updateSettings({ muteUntil: snoozeUntil });
    
    toast({
      title: "😴 Soneca ativada",
      description: `Notificações pausadas por ${minutes} minutos`,
      duration: 2000,
    });
  }, [settings.snoozeMinutes, toast]);

  const scheduleAllNotifications = useCallback(() => {
    if (permission !== 'granted' || !schedulerRef.current) return;

    schedulerRef.current.clearAll();

    // Meal reminders
    if (settings.mealReminders) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      Object.entries(settings.mealTimes).forEach(([mealKey, mealTime]) => {
        if (!mealTime) return;
        
        const timeFormatted = mealTime.split(':').slice(0, 2).join(':');
        const [hours, minutes] = timeFormatted.split(':').map(Number);
        
        if (isNaN(hours) || isNaN(minutes)) return;

        const mealName = mealKey.replace(/_/g, ' ')
          .replace(/meal (\d+)/, 'Refeição $1')
          .replace(/\b\w/g, l => l.toUpperCase());

        // Today
        const todayTime = new Date(today);
        todayTime.setHours(hours, minutes, 0, 0);
        
        if (todayTime > new Date()) {
          scheduleNotification(
            `meal-${mealKey}-${todayTime.getTime()}`,
            `🍽️ ${mealName}`,
            `Está na hora da sua ${mealName.toLowerCase()}. Vamos manter sua dieta em dia!`,
            todayTime,
            'meal'
          );
        }

        // Tomorrow
        const tomorrowTime = new Date(tomorrow);
        tomorrowTime.setHours(hours, minutes, 0, 0);
        
        scheduleNotification(
          `meal-${mealKey}-${tomorrowTime.getTime()}`,
          `🍽️ ${mealName}`,
          `Está na hora da sua ${mealName.toLowerCase()}. Vamos manter sua dieta em dia!`,
          tomorrowTime,
          'meal'
        );
      });
    }

    // Hydration reminders
    if (settings.hydrationReminders) {
      const interval = settings.hydrationInterval * 60 * 60 * 1000;
      const startTime = new Date();
      startTime.setMinutes(0, 0, 0);

      for (let i = 1; i <= 12; i++) {
        const reminderTime = new Date(startTime.getTime() + (interval * i));
        
        scheduleNotification(
          `hydration-${reminderTime.getTime()}`,
          '💧 Hora de se hidratar!',
          'Que tal beber um copo de água? Manter-se hidratado é fundamental!',
          reminderTime,
          'hydration'
        );
      }
    }

    // Connection test
    schedulerRef.current.startReconnectionTest();
  }, [permission, settings, scheduleNotification]);

  const updateSettings = useCallback((newSettings: Partial<EnhancedNotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('enhancedNotificationSettings', JSON.stringify(updatedSettings));

    // Update service worker mute state
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_MUTE_UNTIL',
        payload: { muteUntil: updatedSettings.muteUntil ?? 0 }
      });
    }

    // Reschedule notifications
    scheduleAllNotifications();
  }, [settings, scheduleAllNotifications]);

  // Test connection periodically
  useEffect(() => {
    if (permission === 'granted') {
      const testConnection = () => {
        setConnectionStatus('testing');
        
        setTimeout(() => {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            setConnectionStatus('connected');
          } else {
            setConnectionStatus('disconnected');
          }
        }, 1000);
      };

      const interval = setInterval(testConnection, 60000); // Test every minute
      testConnection(); // Initial test

      return () => clearInterval(interval);
    }
  }, [permission]);

  // Schedule when permission granted
  useEffect(() => {
    if (permission === 'granted') {
      scheduleAllNotifications();
    }
  }, [permission, scheduleAllNotifications]);

  // Reschedule on visibility change
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && permission === 'granted') {
        scheduleAllNotifications();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [permission, scheduleAllNotifications]);

  return {
    permission,
    settings,
    isSupported,
    connectionStatus,
    lastNotificationSent,
    requestPermission,
    updateSettings,
    scheduleAllNotifications,
    snoozeNotifications,
    isInQuietHours
  };
};