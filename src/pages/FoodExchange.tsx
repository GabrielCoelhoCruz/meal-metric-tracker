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
      protein: 'bg-primary/10 text-primary',
      carbohydrate: 'bg-accent/10 text-accent',
      fruit: 'bg-success/10 text-success',
      vegetable: 'bg-success/10 text-success',
      dairy: 'bg-muted text-foreground',
      fat: 'bg-warning/10 text-warning',
      supplement: 'bg-muted text-foreground'
    } as const;
    return (colors as any)[category] || colors.supplement;
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(`/meal/${mealId}`)}
            className="flex items-center gap-2 text-muted-foreground font-medium py-2 px-4 rounded-full border border-border bg-card shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Title Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Trocar Alimento</h1>
            <p className="text-muted-foreground mt-2">
              Escolha um substituto para {originalFood.name}
            </p>
          </section>

          {/* Original Food Info */}
          <section className="bg-card p-6 rounded-2xl shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Alimento Original
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">{originalFood.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(originalFood.category)}`}>
                    {originalFood.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {mealFood.quantity} {mealFood.unit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {Math.round(originalNutrition.calories)} kcal
                </p>
                <div className="flex gap-3 text-xs text-muted-foreground">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar alimentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </section>

          {/* Suggested Foods */}
          <section>
            {sameCategoryFoods.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
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
                        className={`bg-card p-4 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-primary bg-primary/10' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedFood(food)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground">{food.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
                                {food.category}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {Math.round(equivalentQuantity)} {food.defaultUnit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {Math.round(newNutrition.calories)} kcal
                            </p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
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
                <h2 className="text-xl font-semibold text-foreground mb-4">Outras opções</h2>
                <div className="space-y-4">
                  {otherFoods.slice(0, 10).map(food => {
                    const equivalentQuantity = calculateEquivalentQuantity(originalFood, mealFood.quantity, food);
                    const newNutrition = calculateTotalNutrition(food, equivalentQuantity);
                    const isSelected = selectedFood?.id === food.id;
                    
                    return (
                      <div 
                        key={food.id}
                        className={`bg-card p-4 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-primary bg-primary/10' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedFood(food)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground">{food.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
                                {food.category}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {Math.round(equivalentQuantity)} {food.defaultUnit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {Math.round(newNutrition.calories)} kcal
                            </p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
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
              <div className="bg-card p-4 rounded-2xl shadow-lg">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Equivalência Calculada</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {originalFood.name} ({mealFood.quantity} {mealFood.unit}) → {selectedFood.name} ({Math.round(calculateEquivalentQuantity(originalFood, mealFood.quantity, selectedFood))} {selectedFood.defaultUnit})
                  </p>
                  <button
                    onClick={handleSubstitute}
                    className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-full font-semibold shadow-lg hover:bg-primary-hover transition-colors"
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