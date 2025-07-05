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

  const totalNutrition = meal.foods.reduce((total, mealFood) => {
    const food = foods.find(f => f.id === mealFood.foodId);
    if (!food) return total;
    
    const nutrition = calculateTotalNutrition(food, mealFood.quantity);
    return {
      calories: total.calories + nutrition.calories,
      protein: total.protein + nutrition.protein,
      carbohydrates: total.carbohydrates + nutrition.carbohydrates,
      fat: total.fat + nutrition.fat
    };
  }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });

  return (
    <div className={cn(
      "bg-card rounded-3xl p-4 border border-border/30 transition-all duration-200 active:scale-[0.98]",
      isCompleted && "bg-gradient-to-r from-success-light/20 to-success-light/10 border-success/30",
      className
    )}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
          {isCompleted ? (
            <Check className="w-6 h-6 text-success" />
          ) : (
            <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-base mb-1 truncate",
            isCompleted ? "text-success" : "text-foreground"
          )}>
            {meal.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{meal.scheduledTime}</span>
            <span>•</span>
            <span>{meal.foods.length} itens</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          className="h-10 w-10 p-0 rounded-2xl hover:bg-primary/10"
        >
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{Math.round(totalNutrition.calories)}</div>
            <div className="text-xs text-muted-foreground">kcal</div>
          </div>
          
          <div className="flex gap-3 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{Math.round(totalNutrition.carbohydrates)}g</div>
              <div className="text-xs text-muted-foreground">C</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-accent">{Math.round(totalNutrition.protein)}g</div>
              <div className="text-xs text-muted-foreground">P</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-warning">{Math.round(totalNutrition.fat)}g</div>
              <div className="text-xs text-muted-foreground">G</div>
            </div>
          </div>
        </div>
        
        {!isCompleted && progress === 100 && (
          <Button
            onClick={onMarkCompleted}
            size="sm"
            className="bg-success hover:bg-success/90 text-success-foreground rounded-xl h-9 px-4"
          >
            <Check className="w-4 h-4 mr-2" />
            Concluir
          </Button>
        )}
      </div>
      
      {progress > 0 && progress < 100 && (
        <div className="mt-4 pt-3 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{meal.foods.filter(f => f.isCompleted).length}/{meal.foods.length} concluídos</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}