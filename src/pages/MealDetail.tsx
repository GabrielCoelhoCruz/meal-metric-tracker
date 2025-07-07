import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FoodItem } from '@/components/FoodItem';
import { useDiet } from '@/contexts/DietContext';

export default function MealDetail() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const { 
    currentDayPlan, 
    foods, 
    markMealAsCompleted,
    unmarkMealAsCompleted,
    markEntireMealAsCompleted,
    markMealFoodAsCompleted,
    getMealProgress 
  } = useDiet();

  if (!mealId || !currentDayPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Refeição não encontrada</p>
      </div>
    );
  }

  const meal = currentDayPlan.meals.find(m => m.id === mealId);
  
  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Refeição não encontrada</p>
      </div>
    );
  }

  const progress = getMealProgress(mealId);
  const totalCalories = meal.foods.reduce((total, mealFood) => {
    const food = foods.find(f => f.id === mealFood.foodId);
    if (!food) return total;
    const multiplier = mealFood.quantity / food.defaultQuantity;
    return total + (food.nutritionalInfo.calories * multiplier);
  }, 0);

  const totalMacros = meal.foods.reduce((total, mealFood) => {
    const food = foods.find(f => f.id === mealFood.foodId);
    if (!food) return total;
    const multiplier = mealFood.quantity / food.defaultQuantity;
    return {
      carbs: total.carbs + (food.nutritionalInfo.carbohydrates * multiplier),
      protein: total.protein + (food.nutritionalInfo.protein * multiplier),
      fat: total.fat + (food.nutritionalInfo.fat * multiplier)
    };
  }, { carbs: 0, protein: 0, fat: 0 });

  const handleSubstitute = (foodId: string) => {
    navigate(`/food-exchange/${mealId}/${foodId}`);
  };

  const canComplete = progress === 100 && !meal.isCompleted;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{meal.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{meal.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>{Math.round(totalCalories)} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Summary */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Informações Nutricionais</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{Math.round(totalCalories)}</p>
              <p className="text-sm text-muted-foreground">Calorias</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{Math.round(totalMacros.carbs)}g</p>
              <p className="text-sm text-muted-foreground">Carboidratos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{Math.round(totalMacros.protein)}g</p>
              <p className="text-sm text-muted-foreground">Proteínas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{Math.round(totalMacros.fat)}g</p>
              <p className="text-sm text-muted-foreground">Gorduras</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso da refeição</span>
              <span className="text-sm font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mt-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Food List */}
        <div className="space-y-3">
          <h3 className="font-semibold">Alimentos ({meal.foods.length})</h3>
          {meal.foods.map(mealFood => {
            const food = foods.find(f => f.id === mealFood.foodId);
            if (!food) return null;
            
            return (
              <FoodItem
                key={mealFood.id}
                mealFood={mealFood}
                food={food}
                onToggleCompleted={() => markMealFoodAsCompleted(mealId, mealFood.id)}
                onSubstitute={() => handleSubstitute(mealFood.id)}
              />
            );
          })}
        </div>

        {/* Complete Meal Button */}
        {!meal.isCompleted && (
          <Card className="p-4">
            <div className="text-center space-y-3">
              {canComplete ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Todos os alimentos foram marcados como consumidos!
                  </p>
                  <Button
                    onClick={() => markMealAsCompleted(mealId)}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-primary"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Marcar Refeição como Concluída
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Marque todos os alimentos ou conclua a refeição completa
                  </p>
                  <Button
                    onClick={() => markEntireMealAsCompleted(mealId)}
                    size="lg"
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Concluir Refeição Completa
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        {meal.isCompleted && (
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="text-center space-y-3">
              <Check className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold text-success">Refeição Concluída!</h3>
              <p className="text-sm text-success/80">
                Concluída em {meal.completedAt ? new Date(meal.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
              <Button
                onClick={() => unmarkMealAsCompleted(mealId)}
                size="sm"
                variant="outline"
                className="border-success/30 text-success hover:bg-success/10"
              >
                Desfazer Conclusão
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}