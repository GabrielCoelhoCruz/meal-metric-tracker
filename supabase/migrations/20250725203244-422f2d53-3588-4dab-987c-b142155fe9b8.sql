-- Create enum for food categories
CREATE TYPE public.food_category AS ENUM (
  'protein',
  'carbohydrate', 
  'fruit',
  'vegetable',
  'dairy',
  'fat',
  'supplement'
);

-- Create foods table
CREATE TABLE public.foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category food_category NOT NULL,
  calories_per_unit DECIMAL(10,2) NOT NULL,
  carbohydrates_per_unit DECIMAL(10,2) NOT NULL,
  protein_per_unit DECIMAL(10,2) NOT NULL,
  fat_per_unit DECIMAL(10,2) NOT NULL,
  fiber_per_unit DECIMAL(10,2),
  sodium_per_unit DECIMAL(10,2),
  default_unit TEXT NOT NULL,
  default_quantity DECIMAL(10,2) NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily plans table
CREATE TABLE public.daily_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  target_calories INTEGER NOT NULL DEFAULT 2000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create meals table
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_plan_id UUID REFERENCES public.daily_plans(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  scheduled_time TIME NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal foods table (junction table)
CREATE TABLE public.meal_foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  substituted_food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_foods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for foods
CREATE POLICY "Users can view all foods (including global ones)" 
ON public.foods 
FOR SELECT 
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can create their own custom foods" 
ON public.foods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "Users can update their own custom foods" 
ON public.foods 
FOR UPDATE 
USING (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "Users can delete their own custom foods" 
ON public.foods 
FOR DELETE 
USING (auth.uid() = user_id AND is_custom = true);

-- Create RLS policies for daily plans
CREATE POLICY "Users can view their own daily plans" 
ON public.daily_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily plans" 
ON public.daily_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily plans" 
ON public.daily_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily plans" 
ON public.daily_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for meals
CREATE POLICY "Users can view meals from their daily plans" 
ON public.meals 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.daily_plans 
  WHERE daily_plans.id = meals.daily_plan_id 
  AND daily_plans.user_id = auth.uid()
));

CREATE POLICY "Users can create meals in their daily plans" 
ON public.meals 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.daily_plans 
  WHERE daily_plans.id = meals.daily_plan_id 
  AND daily_plans.user_id = auth.uid()
));

CREATE POLICY "Users can update meals in their daily plans" 
ON public.meals 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.daily_plans 
  WHERE daily_plans.id = meals.daily_plan_id 
  AND daily_plans.user_id = auth.uid()
));

CREATE POLICY "Users can delete meals from their daily plans" 
ON public.meals 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.daily_plans 
  WHERE daily_plans.id = meals.daily_plan_id 
  AND daily_plans.user_id = auth.uid()
));

-- Create RLS policies for meal foods
CREATE POLICY "Users can view meal foods from their meals" 
ON public.meal_foods 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.meals 
  JOIN public.daily_plans ON daily_plans.id = meals.daily_plan_id
  WHERE meals.id = meal_foods.meal_id 
  AND daily_plans.user_id = auth.uid()
));

CREATE POLICY "Users can create meal foods in their meals" 
ON public.meal_foods 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.meals 
  JOIN public.daily_plans ON daily_plans.id = meals.daily_plan_id
  WHERE meals.id = meal_foods.meal_id 
  AND daily_plans.user_id = auth.uid()
));

CREATE POLICY "Users can update meal foods in their meals" 
ON public.meal_foods 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.meals 
  JOIN public.daily_plans ON daily_plans.id = meals.daily_plan_id
  WHERE meals.id = meal_foods.meal_id 
  AND daily_plans.user_id = auth.uid()
));

CREATE POLICY "Users can delete meal foods from their meals" 
ON public.meal_foods 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.meals 
  JOIN public.daily_plans ON daily_plans.id = meals.daily_plan_id
  WHERE meals.id = meal_foods.meal_id 
  AND daily_plans.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_foods_updated_at
    BEFORE UPDATE ON public.foods
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_plans_updated_at
    BEFORE UPDATE ON public.daily_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON public.meals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_foods_updated_at
    BEFORE UPDATE ON public.meal_foods
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();