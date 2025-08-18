-- Executar diretamente os comandos para atualizar a dieta
DO $$ 
DECLARE
    plan_id uuid;
    meal1_id uuid;
    meal2_id uuid; 
    meal3_id uuid;
    meal4_id uuid;
    meal5_id uuid;
    meal6_id uuid;
    user_uuid uuid := '16137f11-3d50-4fbf-9b64-c3282ec01cc2';
    plan_date date := CURRENT_DATE;
BEGIN
    -- Buscar ou criar o plano diário
    SELECT id INTO plan_id FROM public.daily_plans 
    WHERE user_id = user_uuid AND date = plan_date;
    
    IF plan_id IS NULL THEN
        INSERT INTO public.daily_plans (user_id, date, target_calories) 
        VALUES (user_uuid, plan_date, 2424) 
        RETURNING id INTO plan_id;
    ELSE
        -- Atualizar calorias alvo
        UPDATE public.daily_plans 
        SET target_calories = 2424 
        WHERE id = plan_id;
        
        -- Deletar refeições existentes
        DELETE FROM public.meal_foods WHERE meal_id IN (
            SELECT id FROM public.meals WHERE daily_plan_id = plan_id
        );
        DELETE FROM public.meals WHERE daily_plan_id = plan_id;
    END IF;
    
    -- Criar as 6 refeições
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 1', '07:00:00') RETURNING id INTO meal1_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 2', '10:00:00') RETURNING id INTO meal2_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 3', '13:00:00') RETURNING id INTO meal3_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 4 (pré treino)', '16:00:00') RETURNING id INTO meal4_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 5 (pós treino)', '18:00:00') RETURNING id INTO meal5_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Ceia', '21:00:00') RETURNING id INTO meal6_id;
    
    -- Refeição 1: Ovos (4 unidades), Pão francês (2 unidades), Banana (100g)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal1_id, '75185daf-c18d-4ca2-aee2-328062960dca', 4, 'unidade'),  -- Ovos
    (meal1_id, '02936f67-d2f8-488f-b1c7-ba2f7f117456', 2, 'unidade'),  -- Pão francês
    (meal1_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 100, 'g');      -- Banana
    
    -- Refeição 2: Arroz (150g), Filé de frango (150g)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal2_id, '79ee1e18-0d91-4f56-a5e7-c3227cd2a589', 150, 'g'),      -- Arroz
    (meal2_id, '6107c9d5-4ba8-4441-a7e6-4fa7eaf26472', 150, 'g');      -- Filé de frango
    
    -- Refeição 3: Whey protein (40g), Banana (100g)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal3_id, 'a03d3a64-3ae8-442f-a2b6-577467fb6e04', 40, 'g'),       -- Whey protein
    (meal3_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 100, 'g');      -- Banana
    
    -- Refeição 4: Arroz (130g), Ovos (4 unidades)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal4_id, '79ee1e18-0d91-4f56-a5e7-c3227cd2a589', 130, 'g'),      -- Arroz
    (meal4_id, '75185daf-c18d-4ca2-aee2-328062960dca', 4, 'unidade');   -- Ovos
    
    -- Refeição 5: Whey protein (40g), Banana (200g)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal5_id, 'a03d3a64-3ae8-442f-a2b6-577467fb6e04', 40, 'g'),       -- Whey protein
    (meal5_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 200, 'g');      -- Banana
    
    -- Ceia: Ovos (4 unidades)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal6_id, '75185daf-c18d-4ca2-aee2-328062960dca', 4, 'unidade');   -- Ovos
    
END $$;