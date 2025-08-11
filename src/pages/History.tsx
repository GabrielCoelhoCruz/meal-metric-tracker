import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Award, ChevronRight, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useStreaks } from '@/hooks/useStreaks';

export default function History() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { dailyRecords, filters, setFilters } = useAnalytics();
  const { current } = useStreaks();

  useEffect(() => {
    setFilters(f => ({ ...f, period: selectedPeriod === 'week' ? '7d' : '30d' }));
  }, [selectedPeriod, setFilters]);

  const completionPct = dailyRecords.length
    ? Math.round(dailyRecords.reduce((s, d) => s + d.completionRate, 0) / dailyRecords.length)
    : 0;
  const avgCalories = dailyRecords.length
    ? Math.round(dailyRecords.reduce((s, d) => s + d.consumedCalories, 0) / dailyRecords.length)
    : 0;
  const totalCompletedMeals = dailyRecords.reduce((s, d) => s + d.completedMeals, 0);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground font-medium py-2 px-4 rounded-full border border-border bg-card shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Title Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
            <p className="text-muted-foreground mt-2">Acompanhe seu progresso</p>
          </section>

          {/* Stats Cards */}
          <section className="bg-card p-6 rounded-2xl shadow-sm mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{completionPct}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{avgCalories}</p>
                <p className="text-sm text-muted-foreground">Média Diária</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{current}</p>
                <p className="text-sm text-muted-foreground">Sequência</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{totalCompletedMeals}</p>
                <p className="text-sm text-muted-foreground">Refeições</p>
              </div>
            </div>
          </section>

          {/* Period Selector */}
          <section>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>

              <TabsContent value="week" className="space-y-4">
                {dailyRecords.map((day) => (
                  <div key={day.date} className="bg-card p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          day.completionRate === 100 ? "bg-success" : "bg-muted"
                        )} />
                        <div>
                          <div className="font-medium text-foreground">
                            {new Date(day.date).toLocaleDateString('pt-BR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {day.totalMeals} refeições • {Math.round(day.consumedCalories)} kcal
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {day.completionRate === 100 && (
                          <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                            Completo
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="month" className="space-y-4">
                {dailyRecords.map((day) => (
                  <div key={day.date} className="bg-card p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          day.completionRate === 100 ? "bg-success" : "bg-muted"
                        )} />
                        <div>
                          <div className="font-medium text-foreground">
                            {new Date(day.date).toLocaleDateString('pt-BR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {day.totalMeals} refeições • {Math.round(day.consumedCalories)} kcal
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {day.completionRate === 100 && (
                          <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                            Completo
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </section>

          {/* Achievements Section */}
          <section className="bg-card p-6 rounded-2xl shadow-sm mt-8 mb-24">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-semibold text-foreground">Conquistas</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm text-foreground">7 dias seguidos</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-foreground">50 refeições</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm text-foreground">Meta mensal</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                <span className="text-sm text-muted-foreground">30 dias perfeitos</span>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <BottomNavigation />
    </div>
  );
}