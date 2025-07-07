import React, { useState } from 'react';
import { Calendar, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function History() {
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-h3">Histórico</h1>
          <p className="text-body-small">Acompanhe seu progresso</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="text-data-large text-primary">{Math.round((currentData.completedMeals / currentData.totalMeals) * 100)}%</div>
            <div className="text-label">Taxa de Conclusão</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-data-large text-accent">{currentData.avgCalories}</div>
            <div className="text-label">Média Diária</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-data-large text-success">{currentData.streak}</div>
            <div className="text-label">Sequência</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-data-large text-warning">{currentData.completedMeals}</div>
            <div className="text-label">Refeições</div>
          </Card>
        </div>

        {/* Period Selector */}
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-4 mt-6">
            <div className="space-y-3">
              {mockHistory.week.days.map((day, index) => (
                <Card key={day.date} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        day.completed ? "bg-success" : "bg-muted"
                      )} />
                      <div>
                        <div className="font-medium">
                          {new Date(day.date).toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                        <div className="text-body-small">
                          {day.meals} refeições • {day.calories} kcal
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {day.completed && (
                        <Badge variant="outline" className="bg-success-light text-success border-success/20">
                          Completo
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="month" className="space-y-4 mt-6">
            <div className="space-y-3">
              {mockHistory.month.weeks.map((week, index) => (
                <Card key={week.week} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">{week.week}</div>
                        <div className="text-body-small">
                          {week.completion}% completa • {week.avgCalories} kcal média
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-data-small text-primary">{week.completion}%</div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="mt-3 progress-container">
                    <div 
                      className="progress-fill"
                      style={{ width: `${week.completion}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Achievements Section */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-warning" />
            <h3 className="font-semibold">Conquistas</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-success-light rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm">7 dias seguidos</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">50 refeições</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-sm">Meta mensal</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              <span className="text-sm text-muted-foreground">30 dias perfeitos</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}