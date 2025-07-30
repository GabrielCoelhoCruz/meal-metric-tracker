import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DailyPlan, Meal, MealFood, Food } from '@/types/diet';
import { toast } from 'sonner';

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
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading foods:', error);
        toast.error('Erro ao carregar alimentos');
        return [];
      }

      return data.map(convertDatabaseFoodToFood);
    } catch (error) {
      console.error('Error loading foods:', error);
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

      // Load daily plan
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
        return null;
      }

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
      console.error('Error loading day plan:', error);
      toast.error('Erro ao carregar plano do dia');
      return null;
    } finally {
      setIsLoading(false);
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
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      };

      if (isCompleted) {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('meals')
        .update(updateData)
        .eq('id', mealId);

      if (error) {
        console.error('Error updating meal completion:', error);
        toast.error('Erro ao atualizar refeição');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating meal completion:', error);
      toast.error('Erro ao atualizar refeição');
      return false;
    }
  };

  const updateMealFoodCompletion = async (mealFoodId: string, isCompleted: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('meal_foods')
        .update({
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', mealFoodId);

      if (error) {
        console.error('Error updating meal food completion:', error);
        toast.error('Erro ao atualizar alimento');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating meal food completion:', error);
      toast.error('Erro ao atualizar alimento');
      return false;
    }
  };

  const updateMealFoodQuantity = async (mealFoodId: string, quantity: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('meal_foods')
        .update({
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', mealFoodId);

      if (error) {
        console.error('Error updating meal food quantity:', error);
        toast.error('Erro ao atualizar quantidade');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating meal food quantity:', error);
      toast.error('Erro ao atualizar quantidade');
      return false;
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

  return {
    isLoading,
    loadFoods,
    loadDayPlan,
    updateMealCompletion,
    updateMealFoodCompletion,
    updateMealFoodQuantity,
    substituteFoodInMeal,
  };
};