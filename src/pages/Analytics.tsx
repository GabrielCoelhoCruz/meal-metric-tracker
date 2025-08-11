import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar, Target, Award, Flame, BarChart3, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useStreaks } from '@/hooks/useStreaks';
import { WeeklyChart } from '@/components/WeeklyChart';
import { StatsCards } from '@/components/StatsCards';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToCsv } from '@/utils/csv';

export default function Analytics() {
  const navigate = useNavigate();
  const { dailyRecords, getWeeklyStats, filters, setFilters, mealTypes, getProgressTrend } = useAnalytics();
  const { current, longest } = useStreaks();
  const weeklyStats = getWeeklyStats();
  const trendData = getProgressTrend();
  const handleExportCsv = () => {
    const headers = ['Data','Refeições Totais','Refeições Concluídas','Taxa de Conclusão (%)','Calorias Consumidas','Carboidratos (g)','Proteínas (g)','Gorduras (g)','Calorias Alvo'];
    const rows = dailyRecords.map(d => [
      String(d.date),
      d.totalMeals,
      d.completedMeals,
      d.completionRate,
      Math.round(d.consumedCalories),
      Math.round(d.consumedCarbohydrates),
      Math.round(d.consumedProtein),
      Math.round(d.consumedFat),
      Math.round(d.targetCalories),
    ]);
    const file = `analytics-${filters.period}-${String(filters.mealType).replace(/\s+/g,'-')}-${filters.macro}-${new Date().toISOString().slice(0,10)}`;
    exportToCsv(file, headers, rows);
  };

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
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 pb-4">
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtros</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Select value={filters.period} onValueChange={(v: any) => setFilters(f => ({ ...f, period: v }))}>
              <SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.mealType} onValueChange={(v: any) => setFilters(f => ({ ...f, mealType: v }))}>
              <SelectTrigger><SelectValue placeholder="Refeição" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {mealTypes.map((mt) => (
                  <SelectItem key={mt} value={mt}>{mt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.macro} onValueChange={(v: any) => setFilters(f => ({ ...f, macro: v }))}>
              <SelectTrigger><SelectValue placeholder="Métrica" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="calories">Calorias</SelectItem>
                <SelectItem value="carbs">Carboidratos</SelectItem>
                <SelectItem value="protein">Proteínas</SelectItem>
                <SelectItem value="fat">Gorduras</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
        <StatsCards stats={weeklyStats} />
      </div>

      {/* Weekly Progress Chart */}
      <div className="px-6 pb-6">
        <WeeklyChart trendData={trendData} title={filters.period === '7d' ? 'Progresso (7 dias)' : 'Progresso (30 dias)'} />
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
              <p className="text-xs text-muted-foreground">{filters.period === '7d' ? 'últimos 7 dias' : 'últimos 30 dias'}</p>
            </div>
          </div>
        </div>

        {/* Average Macro */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              <span className="font-medium">Média diária ({filters.macro})</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-accent">
                {weeklyStats.averageCalories > 0 ? weeklyStats.averageCalories : '-'}
              </p>
              <p className="text-xs text-muted-foreground">{filters.macro === 'calories' ? 'kcal/dia' : 'g/dia'}</p>
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
