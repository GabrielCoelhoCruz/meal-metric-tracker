import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      {/* Header Fixo Mobile */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground">Meal Tracker</h1>
              <p className="text-xs text-muted-foreground">Hoje • {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{Math.round(consumedCalories)}</div>
                <div className="text-xs text-muted-foreground">de {currentDayPlan.targetCalories} kcal</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/meal-management')}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards Horizontal */}
      <div className="px-4 py-4 bg-muted/20">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-3 text-center border border-border/30">
            <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
            <div className="text-xs text-muted-foreground">Progresso</div>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center border border-border/30">
            <div className="text-2xl font-bold text-accent">{completedMeals}</div>
            <div className="text-xs text-muted-foreground">Concluídas</div>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center border border-border/30">
            <div className="text-2xl font-bold text-success">{Math.max(0, currentDayPlan.targetCalories - consumedCalories)}</div>
            <div className="text-xs text-muted-foreground">Restante</div>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="mt-4 bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-2 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (consumedCalories / currentDayPlan.targetCalories) * 100)}%` }}
          />
        </div>
      </div>

      {/* Lista de Refeições */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Refeições de Hoje</h2>
          <div className="text-sm text-muted-foreground">
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
