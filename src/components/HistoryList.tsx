import React from 'react';
import { Clock, Utensils, Zap, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { HistoryRecord } from '@/hooks/useHistoryData';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type HistoryListProps = {
  records: HistoryRecord[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRecordClick?: (record: HistoryRecord) => void;
};

export function HistoryList({ 
  records, 
  isLoading, 
  hasMore, 
  onLoadMore,
  onRecordClick 
}: HistoryListProps) {
  if (isLoading && records.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma refeição encontrada
        </h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros ou o período selecionado
        </p>
      </div>
    );
  }

  const groupedRecords = records.reduce((groups, record) => {
    const date = record.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, HistoryRecord[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedRecords).map(([date, dayRecords]) => (
        <div key={date} className="space-y-3">
          {/* Date Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </h3>
            <Badge variant="outline" className="text-xs">
              {dayRecords.length} refeições
            </Badge>
          </div>

          {/* Day's Meals */}
          <div className="space-y-2">
            {dayRecords.map((record) => (
              <Card
                key={record.id}
                className={cn(
                  "p-4 transition-all duration-200 cursor-pointer hover:shadow-md",
                  record.isCompleted ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"
                )}
                onClick={() => onRecordClick?.(record)}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        record.isCompleted ? "bg-success" : "bg-warning"
                      )} />
                      <div>
                        <h4 className="font-medium text-foreground">{record.mealName}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {record.mealTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={record.isCompleted ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {record.completionRate}%
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <Progress 
                    value={record.completionRate} 
                    className="h-2"
                  />

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Utensils className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {record.completedFoods}/{record.totalFoods} alimentos
                        </span>
                      </div>
                      {record.consumedCalories > 0 && (
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {record.consumedCalories} kcal
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Macros (if meal has calories) */}
                  {record.consumedCalories > 0 && (
                    <div className="flex gap-3 text-xs">
                      <div className="text-muted-foreground">
                        <span className="font-medium text-blue-600">{record.consumedCarbs}g</span> carb
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium text-green-600">{record.consumedProtein}g</span> prot
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium text-orange-600">{record.consumedFat}g</span> gord
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Carregando...' : 'Carregar mais'}
          </Button>
        </div>
      )}
    </div>
  );
}