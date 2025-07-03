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
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="card-glass rounded-2xl p-6 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/20 shadow-primary">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wide">Hoje</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent capitalize">
              {formatDate(date)}
            </h1>
          </div>
          <div className="text-right space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Meta diária</div>
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {Math.round(consumedCalories)}<span className="text-muted-foreground font-normal">/{targetCalories}</span>
            </div>
            <div className="text-xs text-muted-foreground">calorias</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <ProgressCircle progress={progress} size="lg" className="progress-ring">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                <div className="text-xs text-muted-foreground font-medium">concluído</div>
              </div>
            </ProgressCircle>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Refeições</div>
                <div className="font-semibold text-foreground">{completedMeals}/{totalMeals} concluídas</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Restante</div>
                <div className="font-semibold text-accent">
                  {Math.max(0, targetCalories - consumedCalories)} kcal
                </div>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, caloriesProgress)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-2 gap-3">
        {/* Progresso das Refeições */}
        <div className="card-elevated rounded-xl p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Progresso</p>
              <p className="text-lg font-bold text-foreground">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>

        {/* Status da Próxima Refeição */}
        <div className="card-elevated rounded-xl p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              {completedMeals < totalMeals ? (
                <>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Próxima</p>
                  <p className="text-lg font-bold text-foreground">Em breve</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-success uppercase tracking-wide">Completo</p>
                  <p className="text-lg font-bold text-success">Parabéns! 🎉</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}