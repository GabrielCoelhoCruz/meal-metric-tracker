import { useState, useEffect } from 'react';
import { useDiet } from '@/contexts/DietContext';

interface StreakData {
  current: number;
  longest: number;
  lastUpdate: string;
}

export function useStreaks() {
  const [streakData, setStreakData] = useState<StreakData>({
    current: 0,
    longest: 0,
    lastUpdate: ''
  });

  const { currentDayPlan } = useDiet();

  useEffect(() => {
    // Carregar dados do localStorage
    const saved = localStorage.getItem('dietStreaks');
    if (saved) {
      setStreakData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!currentDayPlan) return;

    const today = new Date().toDateString();
    const completedMeals = currentDayPlan.meals.filter(m => m.isCompleted).length;
    const totalMeals = currentDayPlan.meals.length;
    
    // Se todas as refeições foram concluídas
    if (completedMeals === totalMeals && totalMeals > 0) {
      setStreakData(prev => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = prev.lastUpdate === yesterday.toDateString();
        
        const newCurrent = prev.lastUpdate === today ? prev.current : 
                          isYesterday ? prev.current + 1 : 1;
        
        const newData = {
          current: newCurrent,
          longest: Math.max(prev.longest, newCurrent),
          lastUpdate: today
        };
        
        localStorage.setItem('dietStreaks', JSON.stringify(newData));
        return newData;
      });
    }
  }, [currentDayPlan]);

  const resetStreak = () => {
    const newData = { current: 0, longest: streakData.longest, lastUpdate: '' };
    setStreakData(newData);
    localStorage.setItem('dietStreaks', JSON.stringify(newData));
  };

  return {
    ...streakData,
    resetStreak
  };
}