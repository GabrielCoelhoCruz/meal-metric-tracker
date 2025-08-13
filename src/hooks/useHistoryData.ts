import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HistoryFilters } from './useHistoryFilters';
import { useToast } from '@/hooks/use-toast';

export type HistoryRecord = {
  id: string;
  date: string;
  mealName: string;
  mealTime: string;
  totalFoods: number;
  completedFoods: number;
  consumedCalories: number;
  consumedCarbs: number;
  consumedProtein: number;
  consumedFat: number;
  isCompleted: boolean;
  completionRate: number;
};

export type HistoryStats = {
  totalMeals: number;
  completedMeals: number;
  avgCompletionRate: number;
  avgDailyCalories: number;
  currentStreak: number;
  longestStreak: number;
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const ITEMS_PER_PAGE = 20;

type CacheEntry = {
  data: HistoryRecord[];
  timestamp: number;
  filters: string;
};

export function useHistoryData(filters: HistoryFilters) {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [stats, setStats] = useState<HistoryStats>({
    totalMeals: 0,
    completedMeals: 0,
    avgCompletionRate: 0,
    avgDailyCalories: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [cache] = useState(new Map<string, CacheEntry>());
  const { toast } = useToast();

  const getCacheKey = useCallback((filters: HistoryFilters, page: number) => {
    return JSON.stringify({
      dateRange: filters.dateRange,
      mealType: filters.mealType,
      status: filters.status,
      searchQuery: filters.searchQuery,
      page
    });
  }, []);

  const isValidCache = useCallback((entry: CacheEntry) => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }, []);

  const fetchRecords = useCallback(async (loadMore = false) => {
    const currentPage = loadMore ? page + 1 : 0;
    const cacheKey = getCacheKey(filters, currentPage);
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && isValidCache(cached)) {
      if (loadMore) {
        setRecords(prev => [...prev, ...cached.data]);
        setPage(currentPage);
      } else {
        setRecords(cached.data);
        setPage(0);
      }
      setHasMore(cached.data.length === ITEMS_PER_PAGE);
      return;
    }

    setIsLoading(true);
    
    try {
      const fromISO = filters.dateRange.from.toISOString().slice(0, 10);
      const toISO = filters.dateRange.to.toISOString().slice(0, 10);
      const offset = currentPage * ITEMS_PER_PAGE;

      let query = supabase
        .from('meals')
        .select(`
          id,
          name,
          scheduled_time,
          is_completed,
          completed_at,
          daily_plans!inner(date),
          meal_foods(
            id,
            quantity,
            is_completed,
            foods:foods(
              calories_per_unit,
              carbohydrates_per_unit,
              protein_per_unit,
              fat_per_unit,
              default_quantity
            ),
            foods:substituted_food_id(
              calories_per_unit,
              carbohydrates_per_unit,
              protein_per_unit,
              fat_per_unit,
              default_quantity
            )
          )
        `)
        .gte('daily_plans.date', fromISO)
        .lte('daily_plans.date', toISO)
        .order('daily_plans.date', { ascending: false })
        .order('scheduled_time', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      // Apply filters
      if (filters.mealType !== 'all') {
        query = query.eq('name', filters.mealType);
      }

      if (filters.status !== 'all') {
        query = query.eq('is_completed', filters.status === 'completed');
      }

      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const processedRecords: HistoryRecord[] = (data || []).map((meal: any) => {
        const totalFoods = meal.meal_foods?.length || 0;
        const completedFoods = meal.meal_foods?.filter((mf: any) => mf.is_completed)?.length || 0;
        
        // Calculate nutritional values for completed foods
        let consumedCalories = 0;
        let consumedCarbs = 0;
        let consumedProtein = 0;
        let consumedFat = 0;

        meal.meal_foods?.forEach((mf: any) => {
          if (mf.is_completed) {
            const food = mf.foods || mf.substituted_food_id;
            if (food) {
              const factor = Number(mf.quantity) / Number(food.default_quantity || 1);
              consumedCalories += factor * Number(food.calories_per_unit || 0);
              consumedCarbs += factor * Number(food.carbohydrates_per_unit || 0);
              consumedProtein += factor * Number(food.protein_per_unit || 0);
              consumedFat += factor * Number(food.fat_per_unit || 0);
            }
          }
        });

        return {
          id: meal.id,
          date: meal.daily_plans.date,
          mealName: meal.name,
          mealTime: meal.scheduled_time,
          totalFoods,
          completedFoods,
          consumedCalories: Math.round(consumedCalories),
          consumedCarbs: Math.round(consumedCarbs),
          consumedProtein: Math.round(consumedProtein),
          consumedFat: Math.round(consumedFat),
          isCompleted: meal.is_completed,
          completionRate: totalFoods > 0 ? Math.round((completedFoods / totalFoods) * 100) : 0
        };
      });

      // Cache the results
      cache.set(cacheKey, {
        data: processedRecords,
        timestamp: Date.now(),
        filters: JSON.stringify(filters)
      });

      if (loadMore) {
        setRecords(prev => [...prev, ...processedRecords]);
        setPage(currentPage);
      } else {
        setRecords(processedRecords);
        setPage(0);
      }

      setHasMore(processedRecords.length === ITEMS_PER_PAGE);

    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, cache, getCacheKey, isValidCache, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const fromISO = filters.dateRange.from.toISOString().slice(0, 10);
      const toISO = filters.dateRange.to.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from('analytics_daily')
        .select('total_meals, completed_meals, completion_rate, consumed_calories')
        .gte('date', fromISO)
        .lte('date', toISO)
        .order('date', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const totalMeals = data.reduce((sum, d) => sum + d.total_meals, 0);
        const completedMeals = data.reduce((sum, d) => sum + d.completed_meals, 0);
        const avgCompletionRate = Math.round(
          data.reduce((sum, d) => sum + d.completion_rate, 0) / data.length
        );
        const avgDailyCalories = Math.round(
          data.reduce((sum, d) => sum + Number(d.consumed_calories), 0) / data.length
        );

        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        let streak = 0;

        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i].completion_rate === 100) {
            streak++;
            if (i === data.length - 1) currentStreak = streak;
            longestStreak = Math.max(longestStreak, streak);
          } else {
            if (i === data.length - 1) currentStreak = 0;
            streak = 0;
          }
        }

        setStats({
          totalMeals,
          completedMeals,
          avgCompletionRate,
          avgDailyCalories,
          currentStreak,
          longestStreak
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [filters.dateRange]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchRecords(true);
    }
  }, [fetchRecords, isLoading, hasMore]);

  const refresh = useCallback(() => {
    cache.clear();
    setPage(0);
    fetchRecords(false);
    fetchStats();
  }, [cache, fetchRecords, fetchStats]);

  // Fetch data when filters change
  useEffect(() => {
    setPage(0);
    fetchRecords(false);
    fetchStats();
  }, [filters.dateRange, filters.mealType, filters.status, filters.searchQuery]);

  return {
    records,
    stats,
    isLoading,
    hasMore,
    loadMore,
    refresh
  };
}