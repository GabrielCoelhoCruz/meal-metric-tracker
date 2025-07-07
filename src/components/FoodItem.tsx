import React from 'react';
import { Check, ArrowRightLeft, Scale } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableCard } from '@/components/SwipeableCard';
import { AnimatedCheckmark } from '@/components/AnimatedCheckmark';
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
    <SwipeableCard
      onSwipeRight={onToggleCompleted}
      onSwipeLeft={() => {
        // Trigger the edit quantity dialog
        const quantityButton = document.querySelector(`[data-food-id="${mealFood.id}"] button[data-quantity-trigger]`) as HTMLButtonElement;
        if (quantityButton) {
          quantityButton.click();
        }
      }}
      onDoubleTab={onSubstitute}
      rightAction={{
        icon: <Check className="w-4 h-4" />,
        label: mealFood.isCompleted ? "Desfazer" : "Completar",
        color: "hsl(var(--success-foreground))",
        bgColor: "hsl(var(--success))"
      }}
      leftAction={{
        icon: <Scale className="w-4 h-4" />,
        label: "Editar",
        color: "hsl(var(--primary-foreground))",
        bgColor: "hsl(var(--primary))"
      }}
      className={className}
    >
      <div 
        className={cn(
          "bg-card rounded-3xl p-4 border border-border/30 transition-all duration-200",
          mealFood.isCompleted && "bg-gradient-to-r from-success-light/20 to-success-light/10 border-success/30",
          isSubstituted && "border-warning/40 bg-gradient-to-r from-warning-light/15 to-warning-light/5"
        )}
        data-food-id={mealFood.id}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCompleted}
            className={cn(
              "w-12 h-12 p-0 rounded-2xl transition-all duration-200 border-2 flex-shrink-0 active:animate-bounce-in",
              mealFood.isCompleted 
                ? "bg-gradient-to-r from-success to-success-light text-success-foreground border-success" 
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <AnimatedCheckmark isCompleted={mealFood.isCompleted} size={20} />
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
                <button 
                  className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                  data-quantity-trigger
                >
                  <Scale className="w-3 h-3" />
                  {mealFood.quantity} {mealFood.unit}
                </button>
              </EditQuantityDialog>
              <div className="text-base font-bold text-foreground">
                {Math.round(nutrition.calories)} <span className="text-sm font-normal text-muted-foreground">kcal</span>
              </div>
            </div>
            
            {/* Botões de Quantidade Rápida */}
            <div className="flex gap-1 mb-3">
              {[0.5, 1, 1.5, 2].map((multiplier) => {
                const baseQuantity = food.defaultQuantity;
                const newQuantity = baseQuantity * multiplier;
                const isActive = Math.abs(mealFood.quantity - newQuantity) < 0.1;
                
                return (
                  <button
                    key={multiplier}
                    onClick={() => onUpdateQuantity(newQuantity)}
                    className={cn(
                      "flex-1 h-8 text-xs font-medium rounded-lg transition-all duration-200 active:animate-bounce-in",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {multiplier}x
                  </button>
                );
              })}
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
                className="h-10 w-10 p-0 rounded-2xl hover:bg-primary/10 hover:text-primary flex-shrink-0 active:animate-bounce-in"
                data-quantity-trigger
              >
                <Scale className="w-4 h-4" />
              </Button>
            </EditQuantityDialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSubstitute}
              className="h-10 w-10 p-0 rounded-2xl hover:bg-accent/10 hover:text-accent flex-shrink-0 active:animate-bounce-in"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
}