import React from 'react';
import { Clock, ChefHat, Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { cn } from '@/lib/utils';
import { Meal, Food } from '@/types/diet';
import { calculateTotalNutrition } from '@/types/diet';

interface MealCardProps {
  meal: Meal;
  foods: Food[];
  progress: number;
  onMarkCompleted: () => void;
  onViewDetails: () => void;
  className?: string;
}

export function MealCard({ 
  meal, 
  foods, 
  progress, 
  onMarkCompleted, 
  onViewDetails,
  className 
}: MealCardProps) {
  const totalCalories = meal.foods.reduce((total, mealFood) => {
    const food = foods.find(f => f.id === mealFood.foodId);
    if (!food) return total;
    
    const nutrition = calculateTotalNutrition(food, mealFood.quantity);
    return total + nutrition.calories;
  }, 0);

  const isCompleted = meal.isCompleted;
  const progressPercentage = Math.round(progress);

  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-lg",
      isCompleted && "bg-success/5 border-success/20",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ProgressCircle progress={progress} size="md">
            {isCompleted ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <span className="text-xs font-semibold text-foreground">
                {progressPercentage}%
              </span>
            )}
          </ProgressCircle>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                "font-semibold text-base",
                isCompleted && "text-success"
              )}>
                {meal.name}
              </h3>
              {isCompleted && <Check className="w-4 h-4 text-success" />}
            </div>
            
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
            
            <div className="mt-2 text-xs text-muted-foreground">
              {meal.foods.length} alimento{meal.foods.length !== 1 ? 's' : ''}
              {progress > 0 && progress < 100 && (
                <span className="ml-2">• {meal.foods.filter(f => f.isCompleted).length} concluído{meal.foods.filter(f => f.isCompleted).length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex items-center gap-1"
          >
            <span className="hidden sm:inline">Ver detalhes</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          {!isCompleted && progress === 100 && (
            <Button
              onClick={onMarkCompleted}
              size="sm"
              className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-primary"
            >
              <Check className="w-4 h-4 mr-1" />
              Concluir
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}