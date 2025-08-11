import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, RotateCcw, Check, UtensilsCrossed, Dumbbell, Coffee, Apple, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDiet } from '@/contexts/DietContext';
import { StreakCard } from '@/components/StreakCard';

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

  const getMealIcon = (mealName: string) => {
    const name = mealName.toLowerCase();
    if (name.includes('café') || name.includes('manhã')) return Coffee;
    if (name.includes('lanche')) return Apple;
    if (name.includes('almoço') || name.includes('jantar')) return UtensilsCrossed;
    if (name.includes('treino')) return Dumbbell;
    return UtensilsCrossed;
  };

  const getMealCalories = (meal: any) => {
    return meal.foods.reduce((total: number, mealFood: any) => {
      const food = foods.find(f => f.id === mealFood.foodId);
      if (!food) return total;
      const multiplier = mealFood.quantity / food.defaultQuantity;
      return total + (food.nutritionalInfo.calories * multiplier);
    }, 0);
  };

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
  const remainingCalories = Math.max(0, currentDayPlan.targetCalories - consumedCalories);

  const [showMacros, setShowMacros] = useState(false);
  const macros = useMemo(() => {
    if (!currentDayPlan) return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    const totals = { calories: 0, carbs: 0, protein: 0, fat: 0 };
    currentDayPlan.meals
      .filter((m) => m.isCompleted)
      .forEach((meal) => {
        meal.foods.forEach((mf: any) => {
          const food = mf.substitutedFood || foods.find((f) => f.id === mf.foodId);
          if (!food) return;
          const mult = mf.quantity / food.defaultQuantity;
          totals.calories += food.nutritionalInfo.calories * mult;
          totals.carbs += food.nutritionalInfo.carbohydrates * mult;
          totals.protein += food.nutritionalInfo.protein * mult;
          totals.fat += food.nutritionalInfo.fat * mult;
        });
      });
    return totals;
  }, [currentDayPlan, foods]);

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Olá!</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}, Hoje
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-muted"
            onClick={() => navigate('/analytics')}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-muted"
            onClick={() => navigate('/food-substitutions')}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-muted"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Stats Section */}
      <div className="px-6 pb-6 space-y-4">
        {/* Streak Card */}
        <StreakCard />
        
        {/* Calories Card */}
        <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
          <p className="text-sm text-muted-foreground">Calorias Restantes</p>
          <p className="text-4xl font-bold my-2 text-foreground">{remainingCalories}</p>

          <button
            type="button"
            aria-expanded={showMacros}
            onClick={() => setShowMacros((s) => !s)}
            className="w-full mt-4 text-left focus:outline-none"
          >
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (consumedCalories / currentDayPlan.targetCalories) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2 text-muted-foreground">
              <span>Consumido: {Math.round(consumedCalories)} kcal</span>
              <span>Meta: {currentDayPlan.targetCalories} kcal</span>
            </div>
          </button>

          {showMacros && (
            <div className="mt-4 animate-fade-in text-left">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                  <p className="text-sm font-semibold text-foreground">{Math.round(macros.carbs)} g</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Proteínas</p>
                  <p className="text-sm font-semibold text-foreground">{Math.round(macros.protein)} g</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Gorduras</p>
                  <p className="text-sm font-semibold text-foreground">{Math.round(macros.fat)} g</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Meals Section */}
      <div className="px-6 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Refeições de Hoje</h2>
          <span className="text-sm font-medium text-primary">
            {completedMeals}/{currentDayPlan.meals.length} Concluídas
          </span>
        </div>

        <div className="space-y-4">
          {currentDayPlan.meals.map((meal, index) => {
            const MealIcon = getMealIcon(meal.name);
            const mealCalories = getMealCalories(meal);
            
            return (
              <div 
                key={meal.id}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  meal.isCompleted 
                    ? 'bg-muted border-border' 
                    : 'bg-background border-border hover:shadow-md'
                }`}
                onClick={() => navigate(`/meal/${meal.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      meal.isCompleted 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {meal.isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <MealIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{meal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {meal.scheduledTime} • {Math.round(mealCalories)} kcal
                      </p>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    {meal.isCompleted ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-medium text-destructive hover:text-destructive"
                        onClick={() => unmarkMealAsCompleted(meal.id)}
                      >
                        Desfazer
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="text-sm font-semibold"
                        onClick={() => markEntireMealAsCompleted(meal.id)}
                      >
                        Concluir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
