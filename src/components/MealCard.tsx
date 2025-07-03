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
      "card-elevated rounded-xl p-5 transition-all duration-300 hover:shadow-lg interactive group",
      isCompleted && "bg-gradient-to-r from-success-light/20 to-success-light/10 border-success/30",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <ProgressCircle progress={progress} size="md" className="flex-shrink-0">
            {isCompleted ? (
              <Check className="w-5 h-5 text-success" />
            ) : (
              <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
            )}
          </ProgressCircle>
          
          <div>
            <h3 className={cn(
              "font-semibold text-lg mb-1",
              isCompleted ? "text-success" : "text-foreground group-hover:text-primary transition-colors"
            )}>
              {meal.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{meal.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>{meal.foods.length} item{meal.foods.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isCompleted && progress === 100 && (
            <Button
              onClick={onMarkCompleted}
              size="sm"
              className="btn-primary"
            >
              <Check className="w-4 h-4 mr-2" />
              Concluir
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{Math.round(totalNutrition.calories)}</div>
            <div className="text-xs text-muted-foreground font-medium">kcal</div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{Math.round(totalNutrition.carbohydrates)}g</div>
              <div className="text-xs text-muted-foreground">Carb</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{Math.round(totalNutrition.protein)}g</div>
              <div className="text-xs text-muted-foreground">Prot</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{Math.round(totalNutrition.fat)}g</div>
              <div className="text-xs text-muted-foreground">Gord</div>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="btn-ghost hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          <span>Detalhes</span>
        </Button>
      </div>
      
      {progress > 0 && progress < 100 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{meal.foods.filter(f => f.isCompleted).length} de {meal.foods.length} concluídos</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <div 
              className="h-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}