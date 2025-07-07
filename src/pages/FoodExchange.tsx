import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calculator, Check, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDiet } from '@/contexts/DietContext';
import { Food, calculateEquivalentQuantity, calculateTotalNutrition } from '@/types/diet';

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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/meal/${mealId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Trocar Alimento</h1>
            <p className="text-sm text-muted-foreground">
              Escolha um substituto para {originalFood.name}
            </p>
          </div>
        </div>

        {/* Original Food Info */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Alimento Original
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium">{originalFood.name}</h4>
                <Badge variant="outline" className={getCategoryColor(originalFood.category)}>
                  {originalFood.category}
                </Badge>
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
        </Card>

        {/* Search */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar alimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Suggested Foods */}
        <div className="space-y-4">
          {sameCategoryFoods.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">
                Sugestões da mesma categoria ({originalFood.category})
              </h3>
              <div className="grid gap-3">
                {sameCategoryFoods.map(food => {
                  const equivalentQuantity = calculateEquivalentQuantity(originalFood, mealFood.quantity, food);
                  const newNutrition = calculateTotalNutrition(food, equivalentQuantity);
                  const isSelected = selectedFood?.id === food.id;
                  
                  return (
                    <Card 
                      key={food.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{food.name}</h4>
                            <Badge variant="outline" className={getCategoryColor(food.category)}>
                              {food.category}
                            </Badge>
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
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {otherFoods.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Outras opções</h3>
              <div className="grid gap-3">
                {otherFoods.slice(0, 10).map(food => {
                  const equivalentQuantity = calculateEquivalentQuantity(originalFood, mealFood.quantity, food);
                  const newNutrition = calculateTotalNutrition(food, equivalentQuantity);
                  const isSelected = selectedFood?.id === food.id;
                  
                  return (
                    <Card 
                      key={food.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{food.name}</h4>
                            <Badge variant="outline" className={getCategoryColor(food.category)}>
                              {food.category}
                            </Badge>
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
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        {selectedFood && (
          <Card className="p-4">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Equivalência Calculada</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {originalFood.name} ({mealFood.quantity} {mealFood.unit}) → {selectedFood.name} ({Math.round(calculateEquivalentQuantity(originalFood, mealFood.quantity, selectedFood))} {selectedFood.defaultUnit})
              </p>
              <Button
                onClick={handleSubstitute}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-primary"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirmar Substituição
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}