import React from 'react';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressCircle } from '@/components/ui/progress-circle';

interface DailyHeaderProps {
  date: string;
  progress: number;
  consumedCalories: number;
  targetCalories: number;
  completedMeals: number;
  totalMeals: number;
}

export function DailyHeader({
  date,
  progress,
  consumedCalories,
  targetCalories,
  completedMeals,
  totalMeals
}: DailyHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const caloriesProgress = Math.min((consumedCalories / targetCalories) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Header with Date */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Hoje</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground capitalize">
          {formatDate(date)}
        </h1>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progresso do Dia</p>
              <p className="text-2xl font-bold text-foreground">{Math.round(progress)}%</p>
              <p className="text-xs text-muted-foreground">
                {completedMeals} de {totalMeals} refeições
              </p>
            </div>
            <ProgressCircle progress={progress} size="lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </ProgressCircle>
          </div>
        </Card>

        {/* Calories Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Calorias</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(consumedCalories)}
              </p>
              <p className="text-xs text-muted-foreground">
                de {targetCalories} kcal
              </p>
            </div>
            <ProgressCircle progress={caloriesProgress} size="lg">
              <Target className="w-5 h-5 text-primary" />
            </ProgressCircle>
          </div>
        </Card>

        {/* Next Meal */}
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">Próxima Refeição</p>
            {completedMeals < totalMeals ? (
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Em {Math.round(Math.random() * 60 + 30)} min
                </p>
                <p className="text-xs text-muted-foreground">
                  Lembre-se de seguir seu plano!
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-success">
                  Parabéns! 🎉
                </p>
                <p className="text-xs text-muted-foreground">
                  Todas as refeições concluídas
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}