import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DailyHeader } from '@/components/DailyHeader';
import { MealCard } from '@/components/MealCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDiet } from '@/contexts/DietContext';

const Index = () => {
  const navigate = useNavigate();
  const { 
    currentDayPlan, 
    foods, 
    isLoading,
    markMealAsCompleted,
    unmarkMealAsCompleted,
    markEntireMealAsCompleted,
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
    <div className="min-h-screen bg-background">
      {/* Header Clean */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h3">Meal Tracker</h1>
              <p className="text-body-small">Hoje • {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-data-medium text-primary">{Math.round(consumedCalories)}</div>
                <div className="text-body-small">de {currentDayPlan.targetCalories} kcal</div>
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/meal-management')}
                  className="touch-target rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Status Cards */}
      <div className="px-4 py-6 bg-background-secondary">
        <div className="grid grid-cols-3 gap-4">
          <div className="card-elevated p-4 text-center">
            <div className="text-data-large text-primary">{Math.round(progress)}%</div>
            <div className="text-label">Progresso</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="text-data-large text-accent">{completedMeals}</div>
            <div className="text-label">Concluídas</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="text-data-large text-success">{Math.max(0, currentDayPlan.targetCalories - consumedCalories)}</div>
            <div className="text-label">Restante</div>
          </div>
        </div>
        
        {/* Clean Progress Bar */}
        <div className="mt-6 progress-container">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(100, (consumedCalories / currentDayPlan.targetCalories) * 100)}%` }}
          />
        </div>
      </div>

      {/* Clean Meals List */}
      <div className="px-4 py-6 space-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h4">Refeições de Hoje</h2>
          <div className="text-body-small">
            {completedMeals}/{currentDayPlan.meals.length}
          </div>
        </div>
        
        <div className="space-y-3 pb-24">
          {currentDayPlan.meals.map((meal, index) => (
            <div 
              key={meal.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MealCard
                meal={meal}
                foods={foods}
                progress={getMealProgress(meal.id)}
                onMarkCompleted={() => markMealAsCompleted(meal.id)}
                onUnmarkCompleted={() => unmarkMealAsCompleted(meal.id)}
                onMarkEntireCompleted={() => markEntireMealAsCompleted(meal.id)}
                onViewDetails={() => navigate(`/meal/${meal.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
