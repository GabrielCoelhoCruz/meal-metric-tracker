import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar, Target, Award, Flame, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useStreaks } from '@/hooks/useStreaks';
import { WeeklyChart } from '@/components/WeeklyChart';
import { StatsCards } from '@/components/StatsCards';

export default function Analytics() {
  const navigate = useNavigate();
  const { dailyRecords, getWeeklyStats } = useAnalytics();
  const { current, longest } = useStreaks();
  const weeklyStats = getWeeklyStats();

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="p-6 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-full bg-muted"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe seu progresso
          </p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Current Streak */}
          <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Sequência</span>
            </div>
            <p className="text-2xl font-bold">{current}</p>
            <p className="text-xs opacity-80">dias seguidos</p>
          </div>

          {/* Record Streak */}
          <div className="bg-gradient-to-r from-accent to-success text-accent-foreground rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Recorde</span>
            </div>
            <p className="text-2xl font-bold">{longest}</p>
            <p className="text-xs opacity-80">melhor sequência</p>
          </div>
        </div>

        {/* Weekly Stats Cards */}
        <StatsCards />
      </div>

      {/* Weekly Progress Chart */}
      <div className="px-6 pb-6">
        <WeeklyChart />
      </div>

      {/* Detailed Stats */}
      <div className="px-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Estatísticas Detalhadas</h3>
        
        {/* Average Completion */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-medium">Taxa de Conclusão</span>
            </div>
            <span className="text-lg font-bold text-primary">{weeklyStats.averageCompletion}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${weeklyStats.averageCompletion}%` }}
            />
          </div>
        </div>

        {/* Perfect Days */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-success" />
              <span className="font-medium">Dias Perfeitos</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-success">{weeklyStats.perfectDays}</p>
              <p className="text-xs text-muted-foreground">últimos 7 dias</p>
            </div>
          </div>
        </div>

        {/* Average Calories */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              <span className="font-medium">Calorias Médias</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-accent">
                {weeklyStats.averageCalories > 0 ? weeklyStats.averageCalories : '-'}
              </p>
              <p className="text-xs text-muted-foreground">kcal por dia</p>
            </div>
          </div>
        </div>

        {/* History Length */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Dias Registrados</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{dailyRecords.length}</p>
              <p className="text-xs text-muted-foreground">total de dias</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}