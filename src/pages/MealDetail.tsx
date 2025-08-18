import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Check, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDiet } from '@/contexts/DietContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FoodActionModal } from '@/components/FoodActionModal';

export default function MealDetail() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const [selectedMealFood, setSelectedMealFood] = useState<{ mealFood: any; food: any } | null>(null);
  const { 
    currentDayPlan, 
    foods, 
    markMealAsCompleted,
    unmarkMealAsCompleted,
    markEntireMealAsCompleted,
    markMealFoodAsCompleted,
    updateMealFoodQuantity,
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

  const handleQuantityChange = (mealFoodId: string, multiplier: number) => {
    const mealFood = meal.foods.find(mf => mf.id === mealFoodId);
    const food = foods.find(f => f.id === mealFood?.foodId);
    if (mealFood && food) {
      const newQuantity = food.defaultQuantity * multiplier;
      updateMealFoodQuantity(mealId, mealFoodId, newQuantity);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground font-medium py-2 px-4 rounded-full border border-border bg-card shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Meal Title Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{meal.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5" />
                <span>{meal.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-5 h-5" />
                <span>{Math.round(totalCalories)} kcal</span>
              </div>
            </div>
          </section>

          {/* Nutrition Info */}
          <section className="bg-card p-6 rounded-2xl shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Informações Nutricionais</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{Math.round(totalCalories)}</p>
                <p className="text-sm text-muted-foreground">Calorias</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-warning">{Math.round(totalMacros.carbs)}g</p>
                <p className="text-sm text-muted-foreground">Carboidratos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{Math.round(totalMacros.protein)}g</p>
                <p className="text-sm text-muted-foreground">Proteínas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{Math.round(totalMacros.fat)}g</p>
                <p className="text-sm text-muted-foreground">Gorduras</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">Progresso da refeição</span>
                <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </section>

          {/* Food List */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Alimentos ({meal.foods.length})</h2>
            <div className="space-y-4">
              {meal.foods.map(mealFood => {
                const food = foods.find(f => f.id === mealFood.foodId);
                if (!food) return null;

                const multiplier = mealFood.quantity / food.defaultQuantity;
                const calories = Math.round(food.nutritionalInfo.calories * multiplier);
                const carbs = Math.round(food.nutritionalInfo.carbohydrates * multiplier);
                const protein = Math.round(food.nutritionalInfo.protein * multiplier);
                const fat = Math.round(food.nutritionalInfo.fat * multiplier);

                return (
                  <div key={mealFood.id} className="bg-card p-4 rounded-2xl shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {food.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{mealFood.quantity}{mealFood.unit}</span>
                            <span className="text-muted">•</span>
                            <span className="font-medium text-foreground">{calories} <span className="font-normal text-muted-foreground">kcal</span></span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedMealFood({ mealFood, food })}
                        className="text-muted-foreground hover:text-primary flex-shrink-0 ml-2"
                      >
                        {mealFood.isCompleted ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <MoreHorizontal className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center mt-4 border-t pt-4">
                      <div>
                        <p className="font-bold text-foreground">{carbs}g</p>
                        <p className="text-xs text-muted-foreground">C</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{protein}g</p>
                        <p className="text-xs text-muted-foreground">P</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{fat}g</p>
                        <p className="text-xs text-muted-foreground">G</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
      
      <BottomNavigation />
      
      {/* Food Action Modal */}
      {selectedMealFood && (
        <FoodActionModal
          isOpen={!!selectedMealFood}
          onClose={() => setSelectedMealFood(null)}
          mealFood={selectedMealFood.mealFood}
          food={selectedMealFood.food}
          onToggleCompleted={() => markMealFoodAsCompleted(mealId, selectedMealFood.mealFood.id)}
          onUpdateQuantity={(quantity) => updateMealFoodQuantity(mealId, selectedMealFood.mealFood.id, quantity)}
          onSubstitute={() => handleSubstitute(selectedMealFood.mealFood.id)}
        />
      )}
    </div>
  );
}