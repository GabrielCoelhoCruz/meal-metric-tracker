import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useHistoryFilters, FilterPreset, HistoryFilters as HistoryFiltersType } from '@/hooks/useHistoryFilters';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type HistoryFiltersProps = {
  filters: HistoryFiltersType;
  preset: FilterPreset;
  onFiltersChange: (filters: Partial<HistoryFiltersType>) => void;
  onPresetChange: (preset: FilterPreset) => void;
  onReset: () => void;
};

export function HistoryFilters({ 
  filters, 
  preset, 
  onFiltersChange, 
  onPresetChange,
  onReset 
}: HistoryFiltersProps) {
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDateRange, setTempDateRange] = useState(filters.dateRange);

  // Fetch available meal types
  useEffect(() => {
    const fetchMealTypes = async () => {
      const { data } = await supabase
        .from('meals')
        .select('name')
        .order('name');
      
      if (data) {
        const uniqueTypes = Array.from(new Set(data.map(m => m.name)));
        setMealTypes(uniqueTypes);
      }
    };
    fetchMealTypes();
  }, []);

  const activeFiltersCount = [
    filters.mealType !== 'all',
    filters.status !== 'all',
    filters.searchQuery !== '',
    preset === 'custom'
  ].filter(Boolean).length;

  const handleDateRangeApply = () => {
    onFiltersChange({ dateRange: tempDateRange });
    setShowDatePicker(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar refeições..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date Preset Buttons */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          {(['7d', '30d', '3m'] as FilterPreset[]).map((p) => (
            <Button
              key={p}
              variant={preset === p ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPresetChange(p)}
              className="h-8 px-3"
            >
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '3 meses'}
            </Button>
          ))}
        </div>

        {/* Custom Date Range */}
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="w-4 h-4 mr-2" />
              {preset === 'custom' ? 'Personalizado' : 'Datas'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data inicial</label>
                <CalendarComponent
                  mode="single"
                  selected={tempDateRange.from}
                  onSelect={(date) => date && setTempDateRange(prev => ({ ...prev, from: date }))}
                  locale={ptBR}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data final</label>
                <CalendarComponent
                  mode="single"
                  selected={tempDateRange.to}
                  onSelect={(date) => date && setTempDateRange(prev => ({ ...prev, to: date }))}
                  locale={ptBR}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleDateRangeApply}>
                  Aplicar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowDatePicker(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Meal Type Filter */}
        <Select value={filters.mealType} onValueChange={(value) => onFiltersChange({ mealType: value })}>
          <SelectTrigger className="w-auto h-8">
            <SelectValue placeholder="Tipo de refeição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as refeições</SelectItem>
            {mealTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value as any })}>
          <SelectTrigger className="w-auto h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Indicator */}
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="gap-1">
            <Filter className="w-3 h-3" />
            {activeFiltersCount}
          </Badge>
        )}

        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          
          {preset === 'custom' && (
            <Badge variant="outline" className="gap-1">
              {format(filters.dateRange.from, 'dd/MM')} - {format(filters.dateRange.to, 'dd/MM')}
              <button onClick={() => onPresetChange('7d')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.mealType !== 'all' && (
            <Badge variant="outline" className="gap-1">
              {filters.mealType}
              <button onClick={() => onFiltersChange({ mealType: 'all' })}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.status !== 'all' && (
            <Badge variant="outline" className="gap-1">
              {filters.status === 'completed' ? 'Concluídas' : 'Pendentes'}
              <button onClick={() => onFiltersChange({ status: 'all' })}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.searchQuery && (
            <Badge variant="outline" className="gap-1">
              "{filters.searchQuery}"
              <button onClick={() => onFiltersChange({ searchQuery: '' })}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}