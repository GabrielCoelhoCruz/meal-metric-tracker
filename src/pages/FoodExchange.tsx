import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calculator, Check, ArrowRightLeft, Clock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDiet } from '@/contexts/DietContext';
import { Food, calculateEquivalentQuantity, calculateTotalNutrition } from '@/types/diet';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function FoodExchange() {
  const { mealId, foodId } = useParams<{ mealId: string; foodId: string }>();
  const navigate = useNavigate();
  const { currentDayPlan, foods, substituteFoodInMeal } = useDiet();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  if (!mealId || !foodId || !currentDayPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Informações não encontradas</p>
      </div>
    );
  }

  const meal = currentDayPlan.meals.find(m => m.id === mealId);
  const mealFood = meal?.foods.find(f => f.id === foodId);
  const originalFood = foods.find(f => f.id === mealFood?.foodId);

  if (!meal || !mealFood || !originalFood) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Alimento não encontrado</p>
      </div>
    );
  }

  const originalNutrition = calculateTotalNutrition(originalFood, mealFood.quantity);

  // Filtrar alimentos para substituição
  const availableFoods = foods.filter(food => 
    food.id !== originalFood.id &&
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sugerir alimentos da mesma categoria primeiro
  const sameCategoryFoods = availableFoods.filter(food => 
    food.category === originalFood.category
  );
  const otherFoods = availableFoods.filter(food => 
    food.category !== originalFood.category
  );

  const handleSubstitute = () => {
    if (!selectedFood) return;
    
    const equivalentQuantity = calculateEquivalentQuantity(
      originalFood,
      mealFood.quantity,
      selectedFood
    );
    
    substituteFoodInMeal(mealId, foodId, selectedFood, equivalentQuantity);
    navigate(`/meal/${mealId}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      protein: 'bg-blue-100 text-blue-800',
      carbohydrate: 'bg-orange-100 text-orange-800',
      fruit: 'bg-green-100 text-green-800',
      vegetable: 'bg-emerald-100 text-emerald-800',
      dairy: 'bg-purple-100 text-purple-800',
      fat: 'bg-yellow-100 text-yellow-800',
      supplement: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.supplement;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(`/meal/${mealId}`)}
            className="flex items-center gap-2 text-gray-600 font-medium py-2 px-4 rounded-full border border-gray-300 bg-white shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Title Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Trocar Alimento</h1>
            <p className="text-gray-500 mt-2">
              Escolha um substituto para {originalFood.name}
            </p>
          </section>

          {/* Original Food Info */}
          <section className="bg-white p-6 rounded-2xl shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Alimento Original
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-800">{originalFood.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(originalFood.category)}`}>
                    {originalFood.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {mealFood.quantity} {mealFood.unit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {Math.round(originalNutrition.calories)} kcal
                </p>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>C: {Math.round(originalNutrition.carbohydrates)}g</span>
                  <span>P: {Math.round(originalNutrition.protein)}g</span>
                  <span>G: {Math.round(originalNutrition.fat)}g</span>
                </div>
              </div>
            </div>
          </section>

          {/* Search */}
          <section className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar alimentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </section>

          {/* Suggested Foods */}
          <section>
            {sameCategoryFoods.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Sugestões da mesma categoria ({originalFood.category})
                </h2>
                <div className="space-y-4">
                  {sameCategoryFoods.map(food => {
                    const equivalentQuantity = calculateEquivalentQuantity(originalFood, mealFood.quantity, food);
                    const newNutrition = calculateTotalNutrition(food, equivalentQuantity);
                    const isSelected = selectedFood?.id === food.id;
                    
                    return (
                      <div 
                        key={food.id}
                        className={`bg-white p-4 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedFood(food)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-800">{food.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
                                {food.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {Math.round(equivalentQuantity)} {food.defaultUnit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              {Math.round(newNutrition.calories)} kcal
                            </p>
                            <div className="flex gap-3 text-xs text-gray-500">
                              <span>C: {Math.round(newNutrition.carbohydrates)}g</span>
                              <span>P: {Math.round(newNutrition.protein)}g</span>
                              <span>G: {Math.round(newNutrition.fat)}g</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {otherFoods.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Outras opções</h2>
                <div className="space-y-4">
                  {otherFoods.slice(0, 10).map(food => {
                    const equivalentQuantity = calculateEquivalentQuantity(originalFood, mealFood.quantity, food);
                    const newNutrition = calculateTotalNutrition(food, equivalentQuantity);
                    const isSelected = selectedFood?.id === food.id;
                    
                    return (
                      <div 
                        key={food.id}
                        className={`bg-white p-4 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedFood(food)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-800">{food.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
                                {food.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {Math.round(equivalentQuantity)} {food.defaultUnit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              {Math.round(newNutrition.calories)} kcal
                            </p>
                            <div className="flex gap-3 text-xs text-gray-500">
                              <span>C: {Math.round(newNutrition.carbohydrates)}g</span>
                              <span>P: {Math.round(newNutrition.protein)}g</span>
                              <span>G: {Math.round(newNutrition.fat)}g</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Confirm Button */}
          {selectedFood && (
            <section className="fixed bottom-24 left-4 right-4 max-w-sm mx-auto">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Equivalência Calculada</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {originalFood.name} ({mealFood.quantity} {mealFood.unit}) → {selectedFood.name} ({Math.round(calculateEquivalentQuantity(originalFood, mealFood.quantity, selectedFood))} {selectedFood.defaultUnit})
                  </p>
                  <button
                    onClick={handleSubstitute}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <Check className="w-5 h-5 mr-2 inline" />
                    Confirmar Substituição
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
      
      <BottomNavigation />
    </div>
  );
}