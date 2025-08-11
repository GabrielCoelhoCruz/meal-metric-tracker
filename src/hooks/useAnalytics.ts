import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DailyRecord = {
  date: string; // ISO date
  completedMeals: number;
  totalMeals: number;
  consumedCalories: number;
  consumedCarbohydrates: number;
  consumedProtein: number;
  consumedFat: number;
  targetCalories: number;
  completionRate: number; // 0-100
};

export type WeeklyStats = {
  averageCompletion: number;
  totalDays: number;
  perfectDays: number;
  averageCalories: number;
};

export type AnalyticsFilters = {
  period: '7d' | '30d';
  mealType: 'all' | string; // name of the meal (e.g., "Café da manhã")
  macro: 'calories' | 'carbs' | 'protein' | 'fat';
};

function getRange(period: AnalyticsFilters['period']) {
  const to = new Date();
  to.setHours(0, 0, 0, 0);
  const from = new Date(to);
  from.setDate(to.getDate() - (period === '7d' ? 6 : 29));
  const toISO = to.toISOString().slice(0, 10);
  const fromISO = from.toISOString().slice(0, 10);
  return { from, to, fromISO, toISO };
}

export function useAnalytics() {
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({ period: '7d', mealType: 'all', macro: 'calories' });
  const [mealTypes, setMealTypes] = useState<string[]>([]);

  // Fetch available meal types for the range
  useEffect(() => {
    let mounted = true;
    const fetchMealTypes = async () => {
      const { fromISO, toISO } = getRange(filters.period);
      const { data, error } = await supabase
        .from('meals')
        .select('name, daily_plans!inner(date)')
        .gte('daily_plans.date', fromISO)
        .lte('daily_plans.date', toISO)
        .order('name', { ascending: true });
      if (!error && mounted) {
        const names = Array.from(new Set((data || []).map((m: any) => m.name))).filter(Boolean);
        setMealTypes(names);
      }
    };
    fetchMealTypes();
    return () => { mounted = false; };
  }, [filters.period]);

  // Fetch analytics according to filters
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const { fromISO, toISO } = getRange(filters.period);

      if (filters.mealType === 'all') {
        // Use aggregated table
        const { data, error } = await supabase
          .from('analytics_daily')
          .select('date,total_meals,completed_meals,consumed_calories,consumed_carbohydrates,consumed_protein,consumed_fat,target_calories,completion_rate')
          .gte('date', fromISO)
          .lte('date', toISO)
          .order('date', { ascending: true });

        if (!error && mounted) {
          const mapped: DailyRecord[] = (data || []).map((r: any) => ({
            date: r.date,
            totalMeals: r.total_meals,
            completedMeals: r.completed_meals,
            consumedCalories: Number(r.consumed_calories || 0),
            consumedCarbohydrates: Number(r.consumed_carbohydrates || 0),
            consumedProtein: Number(r.consumed_protein || 0),
            consumedFat: Number(r.consumed_fat || 0),
            targetCalories: Number(r.target_calories || 0),
            completionRate: Number(r.completion_rate || 0)
          }));
          setDailyRecords(mapped);
        }
      } else {
        // Filter by specific meal type (compute client-side from related tables)
        const { data: meals, error: mealsErr } = await supabase
          .from('meals')
          .select('id,name,daily_plans!inner(date)')
          .eq('name', filters.mealType)
          .gte('daily_plans.date', fromISO)
          .lte('daily_plans.date', toISO);
        if (mealsErr) { setDailyRecords([]); setIsLoading(false); return; }

        const mealIds = (meals || []).map((m: any) => m.id);
        const mealDateMap = new Map<string, string>();
        (meals || []).forEach((m: any) => mealDateMap.set(m.id, m.daily_plans.date));

        if (mealIds.length === 0) { setDailyRecords([]); setIsLoading(false); return; }

        const { data: items, error: itemsErr } = await supabase
          .from('meal_foods')
          .select('meal_id, quantity, is_completed, foods:foods(id, calories_per_unit, carbohydrates_per_unit, protein_per_unit, fat_per_unit, default_quantity)')
          .in('meal_id', mealIds);
        if (itemsErr) { setDailyRecords([]); setIsLoading(false); return; }

        const perDay = new Map<string, DailyRecord>();
        // initialize days in range to ensure continuity
        const { from, to } = getRange(filters.period);
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          const iso = d.toISOString().slice(0, 10);
          perDay.set(iso, {
            date: iso,
            totalMeals: 0,
            completedMeals: 0,
            consumedCalories: 0,
            consumedCarbohydrates: 0,
            consumedProtein: 0,
            consumedFat: 0,
            targetCalories: 0,
            completionRate: 0,
          });
        }

        // Count meals per day for selected type
        (meals || []).forEach((m: any) => {
          const date = m.daily_plans.date;
          const rec = perDay.get(date);
          if (rec) rec.totalMeals += 1;
        });

        // Sum completed items macros per day
        (items || []).forEach((row: any) => {
          if (!row.is_completed) return;
          const date = mealDateMap.get(row.meal_id);
          if (!date) return;
          const f = row.foods;
          const factor = f && f.default_quantity ? Number(row.quantity) / Number(f.default_quantity) : 0;
          const rec = perDay.get(date);
          if (!rec) return;
          rec.consumedCalories += factor * Number(f?.calories_per_unit || 0);
          rec.consumedCarbohydrates += factor * Number(f?.carbohydrates_per_unit || 0);
          rec.consumedProtein += factor * Number(f?.protein_per_unit || 0);
          rec.consumedFat += factor * Number(f?.fat_per_unit || 0);
        });

        // Completed meals = any selected-type meal with at least one completed item
        const completedByMeal = new Map<string, boolean>();
        (items || []).forEach((row: any) => {
          if (row.is_completed) completedByMeal.set(row.meal_id, true);
        });
        (meals || []).forEach((m: any) => {
          const date = m.daily_plans.date;
          const rec = perDay.get(date);
          if (!rec) return;
          if (completedByMeal.get(m.id)) rec.completedMeals += 1;
          rec.completionRate = rec.totalMeals > 0 ? Math.round((rec.completedMeals * 100) / rec.totalMeals) : 0;
        });

        setDailyRecords(Array.from(perDay.values()).sort((a, b) => a.date.localeCompare(b.date)));
      }
      setIsLoading(false);
    };

    fetchData();
    return () => { mounted = false; };
  }, [filters.period, filters.mealType]);

  const getWeeklyStats = (): WeeklyStats => {
    const days = dailyRecords;
    if (days.length === 0) return { averageCompletion: 0, totalDays: 0, perfectDays: 0, averageCalories: 0 };
    const totalCompletion = days.reduce((sum, d) => sum + d.completionRate, 0);
    const perfectDays = days.filter(d => d.completionRate === 100).length;
    // Macro selection: only impacts average value presented
    const avgMacro = (() => {
      switch (filters.macro) {
        case 'carbs': return days.reduce((s, d) => s + d.consumedCarbohydrates, 0) / days.length;
        case 'protein': return days.reduce((s, d) => s + d.consumedProtein, 0) / days.length;
        case 'fat': return days.reduce((s, d) => s + d.consumedFat, 0) / days.length;
        default: return days.reduce((s, d) => s + d.consumedCalories, 0) / days.length;
      }
    })();

    return {
      averageCompletion: Math.round(totalCompletion / days.length),
      totalDays: days.length,
      perfectDays,
      averageCalories: Math.round(avgMacro)
    };
  };

  const getProgressTrend = () => {
    // keep completion % for the selected period
    return dailyRecords.map(d => ({ date: new Date(d.date).getDate(), completion: d.completionRate }));
  };

  return {
    isLoading,
    dailyRecords,
    mealTypes,
    filters,
    setFilters,
    getWeeklyStats,
    getProgressTrend,
  };
}
