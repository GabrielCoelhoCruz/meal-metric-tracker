import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Check, MoreHorizontal, Scale, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FoodItem } from '@/components/FoodItem';
import { useDiet } from '@/contexts/DietContext';
import { BottomNavigation } from '@/components/BottomNavigation';

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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 font-medium py-2 px-4 rounded-full border border-gray-300 bg-white shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Meal Title Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{meal.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-500">
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
          <section className="bg-white p-6 rounded-2xl shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Nutricionais</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{Math.round(totalCalories)}</p>
                <p className="text-sm text-gray-500">Calorias</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-500">{Math.round(totalMacros.carbs)}g</p>
                <p className="text-sm text-gray-500">Carboidratos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{Math.round(totalMacros.protein)}g</p>
                <p className="text-sm text-gray-500">Proteínas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">{Math.round(totalMacros.fat)}g</p>
                <p className="text-sm text-gray-500">Gorduras</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Progresso da refeição</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </section>

          {/* Food List */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Alimentos ({meal.foods.length})</h2>
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
                  <div key={mealFood.id} className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <ChefHat className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {food.name.length > 15 ? `${food.name.substring(0, 15)}...` : food.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{mealFood.quantity}{mealFood.unit}</span>
                            <span className="text-gray-300">•</span>
                            <span className="font-medium text-gray-700">{calories} <span className="font-normal text-gray-500">kcal</span></span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => markMealFoodAsCompleted(mealId, mealFood.id)}
                        className="text-gray-500 hover:text-primary"
                      >
                        {mealFood.isCompleted ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <MoreHorizontal className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleQuantityChange(mealFood.id, 0.5)}
                          className={`py-1 px-3 rounded-full text-sm font-medium ${
                            Math.abs(multiplier - 0.5) < 0.1 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          0.5x
                        </button>
                        <button 
                          onClick={() => handleQuantityChange(mealFood.id, 1)}
                          className={`py-1 px-3 rounded-full text-sm font-medium ${
                            Math.abs(multiplier - 1) < 0.1 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          1x
                        </button>
                        <button 
                          onClick={() => handleQuantityChange(mealFood.id, 1.5)}
                          className={`py-1 px-3 rounded-full text-sm font-medium ${
                            Math.abs(multiplier - 1.5) < 0.1 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          1.5x
                        </button>
                        <button 
                          onClick={() => handleQuantityChange(mealFood.id, 2)}
                          className={`py-1 px-3 rounded-full text-sm font-medium ${
                            Math.abs(multiplier - 2) < 0.1 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          2x
                        </button>
                      </div>
                      <div className="flex gap-4 text-gray-500">
                        <button onClick={() => handleSubstitute(mealFood.id)}>
                          <RotateCw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center mt-4 border-t pt-4">
                      <div>
                        <p className="font-bold text-gray-700">{carbs}g</p>
                        <p className="text-xs text-gray-500">C</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-700">{protein}g</p>
                        <p className="text-xs text-gray-500">P</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-700">{fat}g</p>
                        <p className="text-xs text-gray-500">G</p>
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
    </div>
  );
}