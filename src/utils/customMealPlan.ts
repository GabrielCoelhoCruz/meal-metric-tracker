import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const createCustomMealPlan = async (userId: string, date: string) => {
  try {
    // First, create the daily plan
    const { data: dailyPlan, error: planError } = await supabase
      .from('daily_plans')
      .insert({
        user_id: userId,
        date,
        target_calories: 2243
      })
      .select()
      .single();

    if (planError) {
      console.error('Error creating daily plan:', planError);
      return null;
    }

    // Get food IDs by name
    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('id, name');

    if (foodsError) {
      console.error('Error fetching foods:', foodsError);
      return null;
    }

    const getFoodId = (name: string) => {
      const food = foods.find(f => f.name.toLowerCase().includes(name.toLowerCase()));
      return food?.id;
    };

    // Define the meal plan structure
    const mealPlan = [
      {
        name: 'Refeição 1',
        scheduled_time: '07:00',
        foods: [
          { name: 'Ovo de galinha inteiro', quantity: 4, unit: 'unidades' },
          { name: 'Pão francês', quantity: 1, unit: 'unidade' },
          { name: 'Banana', quantity: 100, unit: 'g' }
        ]
      },
      {
        name: 'Refeição 2',
        scheduled_time: '12:00',
        foods: [
          { name: 'Arroz tipo 1 cozido', quantity: 100, unit: 'g' },
          { name: 'Filé de frango grelhado', quantity: 150, unit: 'g' },
          { name: 'Mamão formosa', quantity: 100, unit: 'g' }
        ]
      },
      {
        name: 'Refeição 3',
        scheduled_time: '15:00',
        foods: [
          { name: 'Whey Protein isolado', quantity: 40, unit: 'g' },
          { name: 'Mamão formosa', quantity: 100, unit: 'g' },
          { name: 'Banana', quantity: 100, unit: 'g' },
          { name: 'Maçã fuji', quantity: 100, unit: 'g' }
        ]
      },
      {
        name: 'Refeição 4 (pré treino)',
        scheduled_time: '17:00',
        foods: [
          { name: 'Ovo de galinha inteiro', quantity: 4, unit: 'unidades' },
          { name: 'Mamão formosa', quantity: 150, unit: 'g' }
        ]
      },
      {
        name: 'Refeição 5 (pós treino)',
        scheduled_time: '19:00',
        foods: [
          { name: 'Whey Protein isolado', quantity: 40, unit: 'g' },
          { name: 'Banana', quantity: 100, unit: 'g' }
        ]
      },
      {
        name: 'Ceia',
        scheduled_time: '21:00',
        foods: [
          { name: 'Ovo de galinha inteiro', quantity: 4, unit: 'unidades' }
        ]
      }
    ];

    // Create meals and meal foods
    for (const mealData of mealPlan) {
      // Create meal
      const { data: meal, error: mealError } = await supabase
        .from('meals')
        .insert({
          daily_plan_id: dailyPlan.id,
          name: mealData.name,
          scheduled_time: mealData.scheduled_time
        })
        .select()
        .single();

      if (mealError) {
        console.error('Error creating meal:', mealError);
        continue;
      }

      // Add foods to meal
      for (const foodData of mealData.foods) {
        const foodId = getFoodId(foodData.name);
        if (foodId) {
          const { error: mealFoodError } = await supabase
            .from('meal_foods')
            .insert({
              meal_id: meal.id,
              food_id: foodId,
              quantity: foodData.quantity,
              unit: foodData.unit
            });

          if (mealFoodError) {
            console.error('Error adding food to meal:', mealFoodError);
          }
        } else {
          console.warn(`Food not found: ${foodData.name}`);
        }
      }
    }

    return dailyPlan;
  } catch (error) {
    console.error('Error creating custom meal plan:', error);
    return null;
  }
};

export const createTodayCustomPlan = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um plano personalizado",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Check if plan already exists for today
    const { data: existingPlan } = await supabase
      .from('daily_plans')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (existingPlan) {
      toast({
        title: "Plano já existe",
        description: "Já existe um plano para hoje. Delete o existente primeiro.",
        variant: "destructive"
      });
      return;
    }

    const plan = await createCustomMealPlan(user.id, today);
    
    if (plan) {
      toast({
        title: "Sucesso!",
        description: "Plano personalizado criado com base na tabela TACO",
        variant: "default"
      });
      
      // Reload page to show new plan
      window.location.reload();
    } else {
      toast({
        title: "Erro",
        description: "Erro ao criar plano personalizado",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error('Error creating today custom plan:', error);
    toast({
      title: "Erro",
      description: "Erro inesperado ao criar plano",
      variant: "destructive"
    });
  }
};