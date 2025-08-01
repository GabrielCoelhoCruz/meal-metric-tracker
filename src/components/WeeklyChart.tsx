import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function WeeklyChart() {
  const { getProgressTrend } = useAnalytics();
  const trendData = getProgressTrend();

  if (trendData.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Progresso da Semana</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            Complete algumas refeições para ver seu progresso
          </p>
        </div>
      </div>
    );
  }

  const maxHeight = 60;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="font-semibold mb-4">Progresso da Semana</h3>
      
      <div className="flex items-end justify-between space-x-2 h-20">
        {trendData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div 
              className="w-full bg-primary rounded-t transition-all duration-300"
              style={{ 
                height: `${(day.completion / 100) * maxHeight}px`,
                minHeight: day.completion > 0 ? '4px' : '0px'
              }}
            />
            <div className="text-center">
              <p className="text-xs font-medium">{day.date}</p>
              <p className="text-xs text-muted-foreground">{day.completion}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}