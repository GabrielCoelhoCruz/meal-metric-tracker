import React from 'react';
import { TrendingUp, Target, Award, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HistoryStats as HistoryStatsType } from '@/hooks/useHistoryData';

type HistoryStatsProps = {
  stats: HistoryStatsType;
  isLoading?: boolean;
};

export function HistoryStats({ stats, isLoading }: HistoryStatsProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="w-12 h-6 bg-muted rounded mx-auto mb-2" />
              <div className="w-16 h-4 bg-muted rounded mx-auto" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const statItems = [
    {
      icon: TrendingUp,
      value: `${stats.avgCompletionRate}%`,
      label: 'Taxa Média',
      color: 'text-primary'
    },
    {
      icon: Target,
      value: stats.avgDailyCalories,
      label: 'Kcal/dia',
      color: 'text-accent'
    },
    {
      icon: Flame,
      value: stats.currentStreak,
      label: 'Sequência',
      color: 'text-success'
    },
    {
      icon: Award,
      value: `${stats.completedMeals}/${stats.totalMeals}`,
      label: 'Refeições',
      color: 'text-warning'
    }
  ];

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon className={`w-4 h-4 ${item.color} mr-1`} />
                <span className={`text-2xl font-bold ${item.color}`}>
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          );
        })}
      </div>
      
      {stats.longestStreak > stats.currentStreak && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Melhor sequência: <span className="font-semibold text-foreground">{stats.longestStreak} dias</span>
          </p>
        </div>
      )}
    </Card>
  );
}