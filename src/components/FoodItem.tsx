import React from 'react';
import { Check, ArrowRightLeft, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Food, MealFood, calculateTotalNutrition } from '@/types/diet';

interface FoodItemProps {
  mealFood: MealFood;
  food: Food;
  onToggleCompleted: () => void;
  onSubstitute: () => void;
  className?: string;
}

export function FoodItem({ 
  mealFood, 
  food, 
  onToggleCompleted, 
  onSubstitute,
  className 
}: FoodItemProps) {
  const displayFood = mealFood.substitutedFood || food;
  const nutrition = calculateTotalNutrition(displayFood, mealFood.quantity);
  const isSubstituted = !!mealFood.substitutedFood;

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
    <Card className={cn(
      "p-4 transition-all duration-300",
      mealFood.isCompleted && "bg-success/5 border-success/20",
      isSubstituted && "border-warning/50 bg-warning/5",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCompleted}
            className={cn(
              "w-8 h-8 p-0 rounded-full transition-all duration-200",
              mealFood.isCompleted && "bg-success text-success-foreground border-success"
            )}
          >
            {mealFood.isCompleted && <Check className="w-4 h-4" />}
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn(
                "font-medium",
                mealFood.isCompleted && "text-success line-through"
              )}>
                {displayFood.name}
              </h4>
              <Badge variant="outline" className={getCategoryColor(displayFood.category)}>
                {displayFood.category}
              </Badge>
              {isSubstituted && (
                <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/50">
                  Substituído
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {mealFood.quantity} {mealFood.unit} • {Math.round(nutrition.calories)} kcal
            </div>
            
            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
              <span>C: {Math.round(nutrition.carbohydrates)}g</span>
              <span>P: {Math.round(nutrition.protein)}g</span>
              <span>G: {Math.round(nutrition.fat)}g</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSubstitute}
            className="flex items-center gap-1"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trocar</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}