import { useState } from 'react';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { HistoryFilters } from '@/components/HistoryFilters';
import { HistoryStats } from '@/components/HistoryStats';
import { HistoryList } from '@/components/HistoryList';
import { useNavigate } from 'react-router-dom';
import { useHistoryFilters } from '@/hooks/useHistoryFilters';
import { useHistoryData } from '@/hooks/useHistoryData';
import { exportToCsv } from '@/utils/csv';
import { useToast } from '@/hooks/use-toast';

export default function History() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { filters, preset, updateFilters, applyPreset, resetFilters } = useHistoryFilters();
  const { records, stats, isLoading, hasMore, loadMore, refresh } = useHistoryData(filters);

  const handleExportCsv = () => {
    if (records.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Tente ajustar os filtros para obter dados",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Data', 'Refeição', 'Horário', 'Status', 'Taxa de Conclusão (%)',
      'Alimentos Concluídos', 'Total de Alimentos', 'Calorias', 
      'Carboidratos (g)', 'Proteínas (g)', 'Gorduras (g)'
    ];
    
    const rows = records.map(record => [
      record.date,
      record.mealName,
      record.mealTime,
      record.isCompleted ? 'Concluída' : 'Pendente',
      record.completionRate,
      record.completedFoods,
      record.totalFoods,
      record.consumedCalories,
      record.consumedCarbs,
      record.consumedProtein,
      record.consumedFat
    ]);

    const dateRange = `${filters.dateRange.from.toISOString().slice(0,10)}_${filters.dateRange.to.toISOString().slice(0,10)}`;
    const filename = `historico-refeicoes-${dateRange}`;
    
    exportToCsv(filename, headers, rows);
    
    toast({
      title: "Dados exportados",
      description: `${records.length} registros exportados com sucesso`
    });
  };

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
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </header>

        <main className="space-y-6">
          {/* Title Section */}
          <section>
            <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
            <p className="text-muted-foreground mt-2">Acompanhe seu progresso detalhado</p>
          </section>

          {/* Stats */}
          <HistoryStats stats={stats} isLoading={isLoading && records.length === 0} />

          {/* Filters */}
          <HistoryFilters
            filters={filters}
            preset={preset}
            onFiltersChange={updateFilters}
            onPresetChange={applyPreset}
            onReset={resetFilters}
          />

          {/* History List */}
          <HistoryList
            records={records}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onRecordClick={(record) => {
              // Navigate to meal detail or show meal details
              console.log('Clicked record:', record);
            }}
          />
        </main>
        
        {/* Bottom spacing for navigation */}
        <div className="h-24" />
      </div>
      
      <BottomNavigation />
    </div>
  );
}