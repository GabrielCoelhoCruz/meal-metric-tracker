import React, { useState } from 'react';
import { Calendar, TrendingUp, Award, ChevronRight, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Mock data - substituir por dados reais do contexto
  const mockHistory = {
    week: {
      completedMeals: 18,
      totalMeals: 21,
      avgCalories: 1847,
      streak: 5,
      days: [
        { date: '2024-01-07', meals: 3, calories: 1920, completed: true },
        { date: '2024-01-06', meals: 3, calories: 1780, completed: true },
        { date: '2024-01-05', meals: 3, calories: 1950, completed: true },
        { date: '2024-01-04', meals: 2, calories: 1650, completed: false },
        { date: '2024-01-03', meals: 3, calories: 1890, completed: true },
        { date: '2024-01-02', meals: 3, calories: 1820, completed: true },
        { date: '2024-01-01', meals: 3, calories: 2010, completed: true },
      ]
    },
    month: {
      completedMeals: 78,
      totalMeals: 90,
      avgCalories: 1863,
      streak: 12,
      weeks: [
        { week: 'Semana 1', completion: 95, avgCalories: 1845 },
        { week: 'Semana 2', completion: 88, avgCalories: 1920 },
        { week: 'Semana 3', completion: 82, avgCalories: 1780 },
        { week: 'Semana 4', completion: 90, avgCalories: 1890 },
      ]
    }
  };

  const currentData = mockHistory[selectedPeriod as keyof typeof mockHistory];

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
                <p className="text-3xl font-bold text-primary">{Math.round((currentData.completedMeals / currentData.totalMeals) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{currentData.avgCalories}</p>
                <p className="text-sm text-muted-foreground">Média Diária</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{currentData.streak}</p>
                <p className="text-sm text-muted-foreground">Sequência</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{currentData.completedMeals}</p>
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
                {mockHistory.week.days.map((day, index) => (
                  <div key={day.date} className="bg-card p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          day.completed ? "bg-success" : "bg-muted"
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
                            {day.meals} refeições • {day.calories} kcal
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {day.completed && (
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
                {mockHistory.month.weeks.map((week, index) => (
                  <div key={week.week} className="bg-card p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">{week.week}</div>
                          <div className="text-sm text-muted-foreground">
                            {week.completion}% completa • {week.avgCalories} kcal média
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary">{week.completion}%</div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${week.completion}%` }}
                      />
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