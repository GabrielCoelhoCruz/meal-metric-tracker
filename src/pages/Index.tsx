import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DailyHeader } from '@/components/DailyHeader';
import { MealCard } from '@/components/MealCard';
import { useDiet } from '@/contexts/DietContext';

const Index = () => {
  const navigate = useNavigate();
  const { 
    currentDayPlan, 
    foods, 
    isLoading,
    markMealAsCompleted,
    getMealProgress,
    getDailyProgress,
    getCurrentDayCalories
  } = useDiet();

  if (isLoading || !currentDayPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seu plano...</p>
        </div>
      </div>
    );
  }

  const progress = getDailyProgress();
  const consumedCalories = getCurrentDayCalories();
  const completedMeals = currentDayPlan.meals.filter(m => m.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      <div className="container-mobile py-6 space-y-6">
        <div className="animate-fade-in">
          <DailyHeader
            date={currentDayPlan.date}
            progress={progress}
            consumedCalories={consumedCalories}
            targetCalories={currentDayPlan.targetCalories}
            completedMeals={completedMeals}
            totalMeals={currentDayPlan.meals.length}
          />
        </div>

        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Suas Refeições</h2>
            <div className="text-sm text-muted-foreground">
              {completedMeals}/{currentDayPlan.meals.length} concluídas
            </div>
          </div>
          <div className="space-y-3">
            {currentDayPlan.meals.map((meal, index) => (
              <div 
                key={meal.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MealCard
                  meal={meal}
                  foods={foods}
                  progress={getMealProgress(meal.id)}
                  onMarkCompleted={() => markMealAsCompleted(meal.id)}
                  onViewDetails={() => navigate(`/meal/${meal.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
