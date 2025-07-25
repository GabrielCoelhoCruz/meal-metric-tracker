-- Criar planos diários para coelhoc.gabriel de hoje até fim do ano
INSERT INTO daily_plans (user_id, date, target_calories)
SELECT 
    '16137f11-3d50-4fbf-9b64-c3282ec01cc2'::uuid as user_id,
    generate_series(
        '2025-07-26'::date,  
        '2025-12-31'::date,  
        '1 day'::interval
    )::date as date,
    2500 as target_calories  -- Meta estimada baseada no plano
ON CONFLICT (user_id, date) DO NOTHING;

-- Função para criar as refeições para cada plano diário
CREATE OR REPLACE FUNCTION create_fixed_meal_plan(plan_date date, user_uuid uuid)
RETURNS void AS $$
DECLARE
    plan_id uuid;
    meal1_id uuid;
    meal2_id uuid; 
    meal3_id uuid;
    meal4_id uuid;
    meal5_id uuid;
    meal6_id uuid;
BEGIN
    -- Buscar o plano diário
    SELECT id INTO plan_id FROM daily_plans 
    WHERE user_id = user_uuid AND date = plan_date;
    
    IF plan_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Criar as 6 refeições
    INSERT INTO meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 1', '07:00:00') RETURNING id INTO meal1_id;
    
    INSERT INTO meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 2', '10:00:00') RETURNING id INTO meal2_id;
    
    INSERT INTO meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 3', '13:00:00') RETURNING id INTO meal3_id;
    
    INSERT INTO meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 4 (pré treino)', '16:00:00') RETURNING id INTO meal4_id;
    
    INSERT INTO meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Refeição 5 (pós treino)', '18:00:00') RETURNING id INTO meal5_id;
    
    INSERT INTO meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Ceia', '21:00:00') RETURNING id INTO meal6_id;
    
    -- Adicionar alimentos para Refeição 1: Ovos (4 unidades), pão francês (1 unidade), banana (100g)
    INSERT INTO meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal1_id, '75185daf-c18d-4ca2-aee2-328062960dca', 4, 'unidade'), -- Ovos
    (meal1_id, '02936f67-d2f8-488f-b1c7-ba2f7f117456', 1, 'unidade'), -- Pão francês
    (meal1_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 1, 'unidade'); -- Banana (assumindo 100g por unidade)
    
    -- Adicionar alimentos para Refeição 2: Arroz (100g), Filé de frango (150g), Mamão (100g)
    INSERT INTO meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal2_id, 'a03d3a64-3ae8-442f-a2b6-577467fb6e04', 100, 'g'), -- Arroz
    (meal2_id, '78df12ee-f152-4521-b94d-478de12ac274', 150, 'g'), -- Filé de frango
    (meal2_id, '6107c9d5-4ba8-4441-a7e6-4fa7eaf26472', 100, 'g'); -- Mamão
    
    -- Adicionar alimentos para Refeição 3: Whey (40g), Mamão (100g), Banana (100g), Maçã (100g)
    INSERT INTO meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal3_id, '79ee1e18-0d91-4f56-a5e7-c3227cd2a589', 40, 'g'), -- Whey protein
    (meal3_id, '6107c9d5-4ba8-4441-a7e6-4fa7eaf26472', 100, 'g'), -- Mamão
    (meal3_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 1, 'unidade'), -- Banana
    (meal3_id, '8957fc93-eef7-4541-a98f-12a474c003f4', 1, 'unidade'); -- Maçã
    
    -- Adicionar alimentos para Refeição 4: Ovos (4 unidades), Mamão (150g)
    INSERT INTO meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal4_id, '75185daf-c18d-4ca2-aee2-328062960dca', 4, 'unidade'), -- Ovos
    (meal4_id, '6107c9d5-4ba8-4441-a7e6-4fa7eaf26472', 150, 'g'); -- Mamão
    
    -- Adicionar alimentos para Refeição 5: Whey (40g), Banana (100g)
    INSERT INTO meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal5_id, '79ee1e18-0d91-4f56-a5e7-c3227cd2a589', 40, 'g'), -- Whey protein
    (meal5_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 1, 'unidade'); -- Banana
    
    -- Adicionar alimentos para Ceia: Ovos (4 unidades)
    INSERT INTO meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal6_id, '75185daf-c18d-4ca2-aee2-328062960dca', 4, 'unidade'); -- Ovos
    
END;
$$ LANGUAGE plpgsql;

-- Aplicar o plano para todas as datas criadas
DO $$
DECLARE
    plan_date date;
BEGIN
    FOR plan_date IN 
        SELECT generate_series(
            '2025-07-26'::date,
            '2025-12-31'::date,
            '1 day'::interval
        )::date
    LOOP
        PERFORM create_fixed_meal_plan(plan_date, '16137f11-3d50-4fbf-9b64-c3282ec01cc2'::uuid);
    END LOOP;
END $$;