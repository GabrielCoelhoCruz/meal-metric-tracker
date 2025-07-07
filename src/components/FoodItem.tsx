import React from 'react';
import { Check, ArrowRightLeft, Scale } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Food, MealFood, calculateTotalNutrition } from '@/types/diet';
import { EditQuantityDialog } from '@/components/EditQuantityDialog';

interface FoodItemProps {
  mealFood: MealFood;
  food: Food;
  onToggleCompleted: () => void;
  onSubstitute: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
  className?: string;
}

export function FoodItem({ 
  mealFood, 
  food, 
  onToggleCompleted, 
  onSubstitute,
  onUpdateQuantity,
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
      "bg-card rounded-3xl p-4 border border-border/30 transition-all duration-200 active:scale-[0.98]",
      mealFood.isCompleted && "bg-gradient-to-r from-success-light/20 to-success-light/10 border-success/30",
      isSubstituted && "border-warning/40 bg-gradient-to-r from-warning-light/15 to-warning-light/5",
      className
    )}>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleCompleted}
          className={cn(
            "w-12 h-12 p-0 rounded-2xl transition-all duration-200 border-2 flex-shrink-0",
            mealFood.isCompleted 
              ? "bg-gradient-to-r from-success to-success-light text-success-foreground border-success" 
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          {mealFood.isCompleted && <Check className="w-5 h-5" />}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={cn(
              "font-semibold text-base truncate",
              mealFood.isCompleted ? "text-success line-through" : "text-foreground"
            )}>
              {displayFood.name}
            </h4>
            {isSubstituted && (
              <Badge 
                variant="outline" 
                className="bg-warning-light text-warning-foreground border-warning/40 text-xs rounded-full flex-shrink-0"
              >
                Substituído
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <EditQuantityDialog
              mealFood={mealFood}
              food={food}
              onUpdateQuantity={onUpdateQuantity}
            >
              <button className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                <Scale className="w-3 h-3" />
                {mealFood.quantity} {mealFood.unit}
              </button>
            </EditQuantityDialog>
            <div className="text-base font-bold text-foreground">
              {Math.round(nutrition.calories)} <span className="text-sm font-normal text-muted-foreground">kcal</span>
            </div>
          </div>
          
          <div className="flex gap-3 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{Math.round(nutrition.carbohydrates)}g</div>
              <div className="text-xs text-muted-foreground">C</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-accent">{Math.round(nutrition.protein)}g</div>
              <div className="text-xs text-muted-foreground">P</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-warning">{Math.round(nutrition.fat)}g</div>
              <div className="text-xs text-muted-foreground">G</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <EditQuantityDialog
            mealFood={mealFood}
            food={food}
            onUpdateQuantity={onUpdateQuantity}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-2xl hover:bg-primary/10 hover:text-primary flex-shrink-0"
            >
              <Scale className="w-4 h-4" />
            </Button>
          </EditQuantityDialog>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSubstitute}
            className="h-10 w-10 p-0 rounded-2xl hover:bg-accent/10 hover:text-accent flex-shrink-0"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}