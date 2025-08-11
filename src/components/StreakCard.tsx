import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { useStreaks } from '@/hooks/useStreaks';

export function StreakCard() {
  const { current, longest } = useStreaks();

  return (
    <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl p-4 shadow-primary animate-enter hover-scale relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-foreground/10 p-2 rounded-lg">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm opacity-90">Sequência Atual</p>
            <p className="text-2xl font-bold">{current} dias</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1 justify-end mb-1">
            <Trophy className="w-4 h-4 opacity-80" />
            <span className="text-xs opacity-80">Recorde</span>
          </div>
          <p className="text-lg font-semibold">{longest}</p>
        </div>
      </div>
      
      {current > 0 && (
        <div className="mt-3 pt-3 border-t border-foreground/20">
          <p className="text-xs opacity-80">
            {current === 1 ? 'Ótimo começo!' : 
             current < 7 ? 'Continue assim!' :
             current < 14 ? 'Excelente consistência!' :
             'Você é incrível! 🔥'}
          </p>
        </div>
      )}
    </div>
  );
}