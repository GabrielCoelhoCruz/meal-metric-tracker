import { useState, useCallback } from 'react';
import { startOfWeek, endOfWeek, subDays, subWeeks, subMonths } from 'date-fns';

export type DateRange = {
  from: Date;
  to: Date;
};

export type HistoryFilters = {
  dateRange: DateRange;
  mealType: 'all' | string;
  status: 'all' | 'completed' | 'pending';
  searchQuery: string;
};

export type FilterPreset = '7d' | '30d' | '3m' | 'custom';

export function useHistoryFilters() {
  const [filters, setFilters] = useState<HistoryFilters>({
    dateRange: {
      from: subDays(new Date(), 6),
      to: new Date()
    },
    mealType: 'all',
    status: 'all',
    searchQuery: ''
  });

  const [preset, setPreset] = useState<FilterPreset>('7d');

  const applyPreset = useCallback((newPreset: FilterPreset) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    let from: Date;
    
    switch (newPreset) {
      case '7d':
        from = subDays(today, 6);
        break;
      case '30d':
        from = subDays(today, 29);
        break;
      case '3m':
        from = subMonths(today, 3);
        break;
      default:
        return; // custom - don't change range
    }
    
    from.setHours(0, 0, 0, 0);
    
    setPreset(newPreset);
    setFilters(prev => ({
      ...prev,
      dateRange: { from, to: today }
    }));
  }, []);

  const updateFilters = useCallback((updates: Partial<HistoryFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    if (updates.dateRange) {
      setPreset('custom');
    }
  }, []);

  const resetFilters = useCallback(() => {
    applyPreset('7d');
    setFilters(prev => ({
      ...prev,
      mealType: 'all',
      status: 'all',
      searchQuery: ''
    }));
  }, [applyPreset]);

  return {
    filters,
    preset,
    updateFilters,
    applyPreset,
    resetFilters
  };
}