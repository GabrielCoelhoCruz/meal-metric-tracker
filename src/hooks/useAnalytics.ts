import { useState, useEffect } from 'react';
import { useDiet } from '@/contexts/DietContext';

interface DailyRecord {
  date: string;
  completedMeals: number;
  totalMeals: number;
  consumedCalories: number;
  targetCalories: number;
  completionRate: number;
}

interface WeeklyStats {
  averageCompletion: number;
  totalDays: number;
  perfectDays: number;
  averageCalories: number;
}

export function useAnalytics() {
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const { currentDayPlan, getDailyProgress, getCurrentDayCalories } = useDiet();

  useEffect(() => {
    // Carregar histórico do localStorage
    const saved = localStorage.getItem('dietHistory');
    if (saved) {
      setDailyRecords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!currentDayPlan) return;

    const today = new Date().toDateString();
    const completedMeals = currentDayPlan.meals.filter(m => m.isCompleted).length;
    const totalMeals = currentDayPlan.meals.length;
    const consumedCalories = getCurrentDayCalories();
    const progress = getDailyProgress();

    const todayRecord: DailyRecord = {
      date: today,
      completedMeals,
      totalMeals,
      consumedCalories,
      targetCalories: currentDayPlan.targetCalories,
      completionRate: progress
    };

    setDailyRecords(prev => {
      const filtered = prev.filter(record => record.date !== today);
      const updated = [...filtered, todayRecord];
      localStorage.setItem('dietHistory', JSON.stringify(updated));
      return updated;
    });
  }, [currentDayPlan, getCurrentDayCalories, getDailyProgress]);

  const getWeeklyStats = (): WeeklyStats => {
    const lastWeek = dailyRecords.slice(-7);
    
    if (lastWeek.length === 0) {
      return {
        averageCompletion: 0,
        totalDays: 0,
        perfectDays: 0,
        averageCalories: 0
      };
    }

    const totalCompletion = lastWeek.reduce((sum, day) => sum + day.completionRate, 0);
    const perfectDays = lastWeek.filter(day => day.completionRate === 100).length;
    const totalCalories = lastWeek.reduce((sum, day) => sum + day.consumedCalories, 0);

    return {
      averageCompletion: Math.round(totalCompletion / lastWeek.length),
      totalDays: lastWeek.length,
      perfectDays,
      averageCalories: Math.round(totalCalories / lastWeek.length)
    };
  };

  const getProgressTrend = () => {
    const lastSevenDays = dailyRecords.slice(-7).map(day => ({
      date: new Date(day.date).getDate(),
      completion: day.completionRate
    }));
    
    return lastSevenDays;
  };

  return {
    dailyRecords,
    getWeeklyStats,
    getProgressTrend
  };
}