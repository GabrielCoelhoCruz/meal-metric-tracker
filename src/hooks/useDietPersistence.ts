import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DailyPlan, Meal, MealFood, Food } from '@/types/diet';
import { toast } from 'sonner';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface DatabaseDailyPlan {
  id: string;
  user_id: string;
  date: string;
  target_calories: number;
  created_at: string;
  updated_at: string;
}

interface DatabaseMeal {
  id: string;
  daily_plan_id: string;
  name: string;
  scheduled_time: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DatabaseMealFood {
  id: string;
  meal_id: string;
  food_id: string;
  quantity: number;
  unit: string;
  is_completed: boolean;
  substituted_food_id: string | null;
  created_at: string;
  updated_at: string;
}

interface DatabaseFood {
  id: string;
  name: string;
  category: string;
  calories_per_unit: number;
  carbohydrates_per_unit: number;
  protein_per_unit: number;
  fat_per_unit: number;
  fiber_per_unit: number | null;
  sodium_per_unit: number | null;
  default_unit: string;
  default_quantity: number;
  is_custom: boolean;
  user_id: string | null;
}

export const useDietPersistence = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { syncStatus, cacheData, getCachedData, queueOperation } = useOfflineSync();

  const convertDatabaseFoodToFood = (dbFood: DatabaseFood): Food => ({
    id: dbFood.id,
    name: dbFood.name,
    category: dbFood.category as any,
    nutritionalInfo: {
      calories: dbFood.calories_per_unit,
      carbohydrates: dbFood.carbohydrates_per_unit,
      protein: dbFood.protein_per_unit,
      fat: dbFood.fat_per_unit,
      fiber: dbFood.fiber_per_unit || undefined,
      sodium: dbFood.sodium_per_unit || undefined,
    },
    defaultUnit: dbFood.default_unit,
    defaultQuantity: dbFood.default_quantity,
    isCustom: dbFood.is_custom,
  });

  const convertDatabaseMealFoodToMealFood = (dbMealFood: DatabaseMealFood, foods: Food[], substitutedFood?: Food): MealFood => ({
    id: dbMealFood.id,
    foodId: dbMealFood.food_id,
    quantity: dbMealFood.quantity,
    unit: dbMealFood.unit,
    isCompleted: dbMealFood.is_completed,
    substitutedFood,
  });

  const convertDatabaseMealToMeal = (dbMeal: DatabaseMeal, mealFoods: MealFood[]): Meal => ({
    id: dbMeal.id,
    name: dbMeal.name,
    scheduledTime: dbMeal.scheduled_time.slice(0, 5), // Remove seconds: HH:MM:SS -> HH:MM
    foods: mealFoods,
    isCompleted: dbMeal.is_completed,
    completedAt: dbMeal.completed_at ? new Date(dbMeal.completed_at) : undefined,
  });

  const convertDatabaseDailyPlanToDailyPlan = (dbPlan: DatabaseDailyPlan, meals: Meal[]): DailyPlan => ({
    id: dbPlan.id,
    date: dbPlan.date,
    meals,
    targetCalories: dbPlan.target_calories,
  });

  const loadFoods = async (): Promise<Food[]> => {
    try {
      setIsLoading(true);
      
      // Try to load from online first
      if (syncStatus.isOnline) {
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error loading foods online:', error);
          // Fall back to cached data
          const cachedFoods = await getCachedData('foods');
          if (cachedFoods.length > 0) {
            toast.info('Carregando alimentos do cache offline');
            return cachedFoods.map(convertDatabaseFoodToFood);
          }
          toast.error('Erro ao carregar alimentos');
          return [];
        }

        // Cache the data for offline use
        await cacheData('foods', data);
        return data.map(convertDatabaseFoodToFood);
      } else {
        // Load from cache when offline
        const cachedFoods = await getCachedData('foods');
        if (cachedFoods.length > 0) {
          toast.info('Modo offline: carregando alimentos do cache');
          return cachedFoods.map(convertDatabaseFoodToFood);
        } else {
          toast.warning('Nenhum alimento disponível offline');
          return [];
        }
      }
    } catch (error) {
      console.error('Error loading foods:', error);
      // Try cached data as fallback
      try {
        const cachedFoods = await getCachedData('foods');
        if (cachedFoods.length > 0) {
          toast.info('Erro na conexão: usando dados em cache');
          return cachedFoods.map(convertDatabaseFoodToFood);
        }
      } catch (cacheError) {
        console.error('Error loading cached foods:', cacheError);
      }
      toast.error('Erro ao carregar alimentos');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadDayPlan = async (date: string): Promise<DailyPlan | null> => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user');
        return null;
      }

      if (syncStatus.isOnline) {
        // Try online loading first
        const { data: dailyPlanData, error: planError } = await supabase
          .from('daily_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', date)
          .single();

        if (planError) {
          if (planError.code === 'PGRST116') {
            // No plan found for this date, create a default one
            return await createDefaultDayPlan(date, user.id);
          }
          console.error('Error loading daily plan:', planError);
          
          // Try cached data as fallback
          const cachedPlan = await getCachedData(`daily_plan_${date}`);
          if (cachedPlan.length > 0) {
            toast.info('Carregando plano do cache offline');
            return cachedPlan[0];
          }
          return null;
        }

        // Load and cache the complete plan
        const fullPlan = await loadFullPlanData(dailyPlanData, user.id);
        if (fullPlan) {
          await cacheData(`daily_plan_${date}`, [fullPlan]);
        }
        return fullPlan;
      } else {
        // Load from cache when offline
        const cachedPlan = await getCachedData(`daily_plan_${date}`);
        if (cachedPlan.length > 0) {
          toast.info('Modo offline: carregando plano do cache');
          return cachedPlan[0];
        } else {
          toast.warning('Nenhum plano disponível offline para esta data');
          return null;
        }
      }
    } catch (error) {
      console.error('Error loading day plan:', error);
      
      // Try cached data as fallback
      try {
        const cachedPlan = await getCachedData(`daily_plan_${date}`);
        if (cachedPlan.length > 0) {
          toast.info('Erro na conexão: usando plano em cache');
          return cachedPlan[0];
        }
      } catch (cacheError) {
        console.error('Error loading cached plan:', cacheError);
      }
      
      toast.error('Erro ao carregar plano do dia');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadFullPlanData = async (dailyPlanData: DatabaseDailyPlan, userId: string): Promise<DailyPlan | null> => {
    try {
      // Load meals for this plan
      const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('daily_plan_id', dailyPlanData.id)
        .order('scheduled_time');

      if (mealsError) {
        console.error('Error loading meals:', mealsError);
        return null;
      }

      // Load meal foods for all meals
      const mealIds = mealsData.map(meal => meal.id);
      const { data: mealFoodsData, error: mealFoodsError } = await supabase
        .from('meal_foods')
        .select('*')
        .in('meal_id', mealIds);

      if (mealFoodsError) {
        console.error('Error loading meal foods:', mealFoodsError);
        return null;
      }

      // Load foods to get food details
      const { data: foodsData, error: foodsError } = await supabase
        .from('foods')
        .select('*');

      if (foodsError) {
        console.error('Error loading foods:', foodsError);
        return null;
      }

      const foods = foodsData.map(convertDatabaseFoodToFood);

      // Group meal foods by meal and convert
      const meals = mealsData.map(dbMeal => {
        const mealFoodsForMeal = mealFoodsData.filter(mf => mf.meal_id === dbMeal.id);
        const mealFoods = mealFoodsForMeal.map(dbMealFood => {
          const substitutedFood = dbMealFood.substituted_food_id 
            ? foods.find(f => f.id === dbMealFood.substituted_food_id)
            : undefined;
          return convertDatabaseMealFoodToMealFood(dbMealFood, foods, substitutedFood);
        });
        return convertDatabaseMealToMeal(dbMeal, mealFoods);
      });

      return convertDatabaseDailyPlanToDailyPlan(dailyPlanData, meals);
    } catch (error) {
      console.error('Error loading full plan data:', error);
      return null;
    }
  };

  const createDefaultDayPlan = async (date: string, userId: string): Promise<DailyPlan | null> => {
    try {
      // Create daily plan
      const { data: planData, error: planError } = await supabase
        .from('daily_plans')
        .insert({
          user_id: userId,
          date,
          target_calories: 2000
        })
        .select()
        .single();

      if (planError) {
        console.error('Error creating daily plan:', planError);
        return null;
      }

      // Create default meals
      const defaultMeals = [
        { name: 'Café da Manhã', scheduled_time: '07:00' },
        { name: 'Lanche da Manhã', scheduled_time: '09:30' },
        { name: 'Almoço', scheduled_time: '12:00' },
        { name: 'Lanche da Tarde', scheduled_time: '15:30' },
        { name: 'Jantar', scheduled_time: '19:00' },
        { name: 'Ceia', scheduled_time: '21:00' }
      ];

      const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .insert(
          defaultMeals.map(meal => ({
            daily_plan_id: planData.id,
            name: meal.name,
            scheduled_time: meal.scheduled_time
          }))
        )
        .select();

      if (mealsError) {
        console.error('Error creating default meals:', mealsError);
        return null;
      }

      const meals = mealsData.map(dbMeal => convertDatabaseMealToMeal(dbMeal, []));
      return convertDatabaseDailyPlanToDailyPlan(planData, meals);
    } catch (error) {
      console.error('Error creating default day plan:', error);
      return null;
    }
  };

  const updateMealCompletion = async (mealId: string, isCompleted: boolean): Promise<boolean> => {
    try {
      const updateData: any = {
        id: mealId,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      };

      if (isCompleted) {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      if (syncStatus.isOnline) {
        const { error } = await supabase
          .from('meals')
          .update(updateData)
          .eq('id', mealId);

        if (error) {
          console.error('Error updating meal completion:', error);
          // Queue for offline sync
          await queueOperation('update', 'meals', updateData);
          return true; // Return true for optimistic update
        }
      } else {
        // Queue for offline sync
        await queueOperation('update', 'meals', updateData);
      }

      return true;
    } catch (error) {
      console.error('Error updating meal completion:', error);
      // Still queue for sync as fallback
      await queueOperation('update', 'meals', {
        id: mealId,
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
        ...(isCompleted ? { completed_at: new Date().toISOString() } : { completed_at: null })
      });
      return true;
    }
  };

  const updateMealFoodCompletion = async (mealFoodId: string, isCompleted: boolean): Promise<boolean> => {
    try {
      const updateData = {
        id: mealFoodId,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      };

      if (syncStatus.isOnline) {
        const { error } = await supabase
          .from('meal_foods')
          .update(updateData)
          .eq('id', mealFoodId);

        if (error) {
          console.error('Error updating meal food completion:', error);
          await queueOperation('update', 'meal_foods', updateData);
          return true;
        }
      } else {
        await queueOperation('update', 'meal_foods', updateData);
      }

      return true;
    } catch (error) {
      console.error('Error updating meal food completion:', error);
      await queueOperation('update', 'meal_foods', {
        id: mealFoodId,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      });
      return true;
    }
  };

  const updateMealFoodQuantity = async (mealFoodId: string, quantity: number): Promise<boolean> => {
    try {
      const updateData = {
        id: mealFoodId,
        quantity,
        updated_at: new Date().toISOString()
      };

      if (syncStatus.isOnline) {
        const { error } = await supabase
          .from('meal_foods')
          .update(updateData)
          .eq('id', mealFoodId);

        if (error) {
          console.error('Error updating meal food quantity:', error);
          await queueOperation('update', 'meal_foods', updateData);
          return true; // Optimistic update
        }
      } else {
        await queueOperation('update', 'meal_foods', updateData);
      }

      return true;
    } catch (error) {
      console.error('Error updating meal food quantity:', error);
      await queueOperation('update', 'meal_foods', {
        id: mealFoodId,
        quantity,
        updated_at: new Date().toISOString()
      });
      return true;
    }
  };

  const substituteFoodInMeal = async (mealFoodId: string, newFoodId: string, newQuantity: number) => {
    try {
      // Get the new food to get its default unit
      const { data: newFood, error: foodError } = await supabase
        .from('foods')
        .select('default_unit')
        .eq('id', newFoodId)
        .single();

      if (foodError) {
        console.error('Error getting new food data:', foodError);
        toast.error('Erro ao buscar dados do novo alimento');
        return false;
      }

      const { error } = await supabase
        .from('meal_foods')
        .update({ 
          substituted_food_id: newFoodId,
          quantity: newQuantity,
          unit: newFood.default_unit
        })
        .eq('id', mealFoodId);

      if (error) {
        console.error('Error substituting food:', error);
        toast.error('Erro ao substituir alimento');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error substituting food:', error);
      toast.error('Erro ao substituir alimento');
      return false;
    }
  };

  const addMeal = async (meal: Meal, dailyPlanId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('meals')
        .insert({
          id: meal.id,
          daily_plan_id: dailyPlanId,
          name: meal.name,
          scheduled_time: meal.scheduledTime,
          is_completed: meal.isCompleted || false
        });

      if (error) {
        console.error('Error adding meal:', error);
        toast.error('Erro ao adicionar refeição');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding meal:', error);
      toast.error('Erro ao adicionar refeição');
      return false;
    }
  };

  const updateMeal = async (meal: Meal): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('meals')
        .update({
          name: meal.name,
          scheduled_time: meal.scheduledTime,
          is_completed: meal.isCompleted || false,
          completed_at: meal.completedAt ? meal.completedAt.toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', meal.id);

      if (error) {
        console.error('Error updating meal:', error);
        toast.error('Erro ao atualizar refeição');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating meal:', error);
      toast.error('Erro ao atualizar refeição');
      return false;
    }
  };

  const deleteMeal = async (mealId: string): Promise<boolean> => {
    try {
      // First delete all meal_foods for this meal
      const { error: mealFoodsError } = await supabase
        .from('meal_foods')
        .delete()
        .eq('meal_id', mealId);

      if (mealFoodsError) {
        console.error('Error deleting meal foods:', mealFoodsError);
        toast.error('Erro ao excluir alimentos da refeição');
        return false;
      }

      // Then delete the meal
      const { error: mealError } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);

      if (mealError) {
        console.error('Error deleting meal:', mealError);
        toast.error('Erro ao excluir refeição');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Erro ao excluir refeição');
      return false;
    }
  };

  const addMealFood = async (mealId: string, foodId: string, quantity: number, unit: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('meal_foods')
        .insert({
          meal_id: mealId,
          food_id: foodId,
          quantity,
          unit,
          is_completed: false
        });

      if (error) {
        console.error('Error adding meal food:', error);
        toast.error('Erro ao adicionar alimento à refeição');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding meal food:', error);
      toast.error('Erro ao adicionar alimento à refeição');
      return false;
    }
  };

  const deleteMealFood = async (mealFoodId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('meal_foods')
        .delete()
        .eq('id', mealFoodId);

      if (error) {
        console.error('Error deleting meal food:', error);
        toast.error('Erro ao remover alimento da refeição');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting meal food:', error);
      toast.error('Erro ao remover alimento da refeição');
      return false;
    }
  };

  return {
    isLoading,
    loadFoods,
    loadDayPlan,
    updateMealCompletion,
    updateMealFoodCompletion,
    updateMealFoodQuantity,
    substituteFoodInMeal,
    addMeal,
    updateMeal,
    deleteMeal,
    addMealFood,
    deleteMealFood,
  };
};