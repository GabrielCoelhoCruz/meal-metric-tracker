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
    <div className={cn(
      "card-elevated rounded-xl p-4 transition-all duration-300 hover:shadow-md interactive",
      mealFood.isCompleted && "bg-gradient-to-r from-success-light/20 to-success-light/10 border-success/30",
      isSubstituted && "border-warning/40 bg-gradient-to-r from-warning-light/15 to-warning-light/5",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCompleted}
            className={cn(
              "w-10 h-10 p-0 rounded-full transition-all duration-200 border-2",
              mealFood.isCompleted 
                ? "bg-gradient-to-r from-success to-success-light text-success-foreground border-success shadow-sm" 
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            {mealFood.isCompleted && <Check className="w-5 h-5" />}
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={cn(
                "font-semibold text-base",
                mealFood.isCompleted ? "text-success line-through" : "text-foreground"
              )}>
                {displayFood.name}
              </h4>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-medium rounded-full",
                  getCategoryColor(displayFood.category)
                )}
              >
                {displayFood.category}
              </Badge>
              {isSubstituted && (
                <Badge 
                  variant="outline" 
                  className="bg-warning-light text-warning-foreground border-warning/40 text-xs rounded-full"
                >
                  Substituído
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground font-medium">
                {mealFood.quantity} {mealFood.unit}
              </div>
              <div className="text-lg font-bold text-foreground">
                {Math.round(nutrition.calories)} <span className="text-sm font-normal text-muted-foreground">kcal</span>
              </div>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{Math.round(nutrition.carbohydrates)}g</div>
                <div className="text-xs text-muted-foreground">Carb</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{Math.round(nutrition.protein)}g</div>
                <div className="text-xs text-muted-foreground">Prot</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">{Math.round(nutrition.fat)}g</div>
                <div className="text-xs text-muted-foreground">Gord</div>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSubstitute}
          className="btn-ghost hover:bg-accent/10 hover:text-accent hover:border-accent/30 flex items-center gap-2"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trocar</span>
        </Button>
      </div>
    </div>
  );
}