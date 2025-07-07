import React from 'react';
import { Clock, ChefHat, Check, ArrowRight, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { SwipeableCard } from '@/components/SwipeableCard';
import { AnimatedCheckmark } from '@/components/AnimatedCheckmark';
import { Confetti } from '@/components/Confetti';
import { cn } from '@/lib/utils';
import { Meal, Food } from '@/types/diet';
import { calculateTotalNutrition } from '@/types/diet';

interface MealCardProps {
  meal: Meal;
  foods: Food[];
  progress: number;
  onMarkCompleted: () => void;
  onUnmarkCompleted: () => void;
  onMarkEntireCompleted: () => void;
  onViewDetails: () => void;
  className?: string;
}

export function MealCard({ 
  meal, 
  foods, 
  progress, 
  onMarkCompleted, 
  onUnmarkCompleted,
  onMarkEntireCompleted,
  onViewDetails,
  className 
}: MealCardProps) {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [prevProgress, setPrevProgress] = React.useState(progress);
  
  // Trigger confetti when meal reaches 100%
  React.useEffect(() => {
    if (progress === 100 && prevProgress < 100 && !meal.isCompleted) {
      setShowConfetti(true);
    }
    setPrevProgress(progress);
  }, [progress, prevProgress, meal.isCompleted]);
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

  const handleSwipeRight = () => {
    if (isCompleted) {
      onUnmarkCompleted();
    } else if (progress === 100) {
      onMarkCompleted();
    } else {
      onMarkEntireCompleted();
    }
  };

  const handleSwipeLeft = () => {
    onViewDetails();
  };

  const handleDoubleTab = () => {
    if (!isCompleted) {
      onMarkEntireCompleted();
    }
  };

  return (
    <>
      <Confetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      <SwipeableCard
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        onDoubleTab={handleDoubleTab}
        rightAction={{
          icon: <Check className="w-4 h-4" />,
          label: isCompleted ? "Desfazer" : progress === 100 ? "Concluir" : "Concluir Tudo",
          color: "hsl(var(--success-foreground))",
          bgColor: "hsl(var(--success))"
        }}
        leftAction={{
          icon: <Edit className="w-4 h-4" />,
          label: "Editar",
          color: "hsl(var(--primary-foreground))",
          bgColor: "hsl(var(--primary))"
        }}
        className={className}
      >
        <div className={cn(
          isCompleted ? "card-meal-completed" : "card-meal",
          "interactive"
        )}>
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300",
              progress === 100 && !isCompleted && "animate-pulse-success"
            )}>
              {isCompleted ? (
                <AnimatedCheckmark isCompleted={true} size={24} />
              ) : (
                <span className="text-data-small text-primary">{progressPercentage}%</span>
              )}
            </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-h4 mb-1 truncate",
              isCompleted ? "text-success" : "text-foreground"
            )}>
              {meal.name}
            </h3>
            <div className="flex items-center space-sm text-body-small">
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
            className="touch-target rounded-lg active:animate-bounce-in"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-lg">
            <div className="text-center">
              <div className="text-data-medium">{Math.round(totalNutrition.calories)}</div>
              <div className="text-label">kcal</div>
            </div>
            
            <div className="flex space-sm">
              <div className="text-center">
                <div className="text-data-small text-primary">{Math.round(totalNutrition.carbohydrates)}g</div>
                <div className="text-label">C</div>
              </div>
              <div className="text-center">
                <div className="text-data-small text-accent">{Math.round(totalNutrition.protein)}g</div>
                <div className="text-label">P</div>
              </div>
              <div className="text-center">
                <div className="text-data-small text-warning">{Math.round(totalNutrition.fat)}g</div>
                <div className="text-label">G</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-sm">
            {isCompleted ? (
              <Button
                onClick={onUnmarkCompleted}
                size="sm"
                variant="outline"
                className="status-completed active:animate-bounce-in"
              >
                Desfazer
              </Button>
            ) : (
              <>
                {progress === 100 && (
                  <Button
                    onClick={onMarkCompleted}
                    size="sm"
                    className="bg-success text-success-foreground active:animate-bounce-in animate-float"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Concluir
                  </Button>
                )}
                {progress < 100 && (
                  <Button
                    onClick={onMarkEntireCompleted}
                    size="sm"
                    variant="outline"
                    className="active:animate-bounce-in"
                  >
                    Concluir Tudo
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {progress > 0 && progress < 100 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-body-small mb-2">
              <span>{meal.foods.filter(f => f.isCompleted).length}/{meal.foods.length} concluídos</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-container">
              <div 
                className={cn(
                  "progress-fill transition-all duration-500",
                  progress === 100 && "animate-pulse-success"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </SwipeableCard>
    </>
  );
}