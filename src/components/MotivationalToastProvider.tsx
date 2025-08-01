import React, { useEffect } from 'react';
import { useDiet } from '@/contexts/DietContext';
import { useStreaks } from '@/hooks/useStreaks';
import { useMotivationalToast } from '@/hooks/useMotivationalToast';

export function MotivationalToastProvider({ children }: { children: React.ReactNode }) {
  const { currentDayPlan, getDailyProgress, getCurrentDayCalories } = useDiet();
  const { current } = useStreaks();
  const { 
    showDailyGoalToast, 
    showCalorieGoalToast, 
    showProgressToast, 
    showWeeklyStreakToast 
  } = useMotivationalToast();

  useEffect(() => {
    if (!currentDayPlan) return;

    const completedMeals = currentDayPlan.meals.filter(m => m.isCompleted).length;
    const totalMeals = currentDayPlan.meals.length;
    const progress = getDailyProgress();
    const consumedCalories = getCurrentDayCalories();
    
    // Check for daily goal completion
    if (completedMeals === totalMeals && totalMeals > 0) {
      const lastDailyGoalToast = localStorage.getItem('lastDailyGoalToast');
      const today = new Date().toDateString();
      
      if (lastDailyGoalToast !== today) {
        showDailyGoalToast();
        localStorage.setItem('lastDailyGoalToast', today);
      }
    }

    // Check for calorie goal achievement
    const caloriePercentage = (consumedCalories / currentDayPlan.targetCalories) * 100;
    if (caloriePercentage >= 90 && caloriePercentage <= 110 && completedMeals === totalMeals) {
      const lastCalorieToast = localStorage.getItem('lastCalorieToast');
      const today = new Date().toDateString();
      
      if (lastCalorieToast !== today) {
        showCalorieGoalToast(caloriePercentage);
        localStorage.setItem('lastCalorieToast', today);
      }
    }

    // Check for progress milestones
    showProgressToast(completedMeals, totalMeals);

  }, [currentDayPlan, getDailyProgress, getCurrentDayCalories, showDailyGoalToast, showCalorieGoalToast, showProgressToast]);

  useEffect(() => {
    // Check for weekly streak milestones
    if (current > 0 && [7, 14, 30].includes(current)) {
      const lastStreakToast = localStorage.getItem(`streakToast_${current}`);
      const today = new Date().toDateString();
      
      if (lastStreakToast !== today) {
        showWeeklyStreakToast(current);
        localStorage.setItem(`streakToast_${current}`, today);
      }
    }
  }, [current, showWeeklyStreakToast]);

  return <>{children}</>;
}