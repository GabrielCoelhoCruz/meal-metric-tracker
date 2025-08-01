import React from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function StatsCards() {
  const { getWeeklyStats } = useAnalytics();
  const stats = getWeeklyStats();

  const cards = [
    {
      icon: TrendingUp,
      label: 'Média Semanal',
      value: `${stats.averageCompletion}%`,
      color: 'text-primary'
    },
    {
      icon: Award,
      label: 'Dias Perfeitos',
      value: stats.perfectDays,
      color: 'text-success'
    },
    {
      icon: Target,
      label: 'Calorias/Dia',
      value: stats.averageCalories > 0 ? `${stats.averageCalories}` : '-',
      color: 'text-accent'
    },
    {
      icon: Calendar,
      label: 'Dias Ativos',
      value: stats.totalDays,
      color: 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <card.icon className={`w-4 h-4 ${card.color}`} />
            <span className="text-xs text-muted-foreground">{card.label}</span>
          </div>
          <p className="text-lg font-bold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}