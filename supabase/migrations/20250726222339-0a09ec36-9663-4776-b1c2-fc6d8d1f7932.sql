-- Remover plano atual da usuária
DELETE FROM public.meal_foods 
WHERE meal_id IN (
  SELECT m.id FROM public.meals m 
  JOIN public.daily_plans dp ON dp.id = m.daily_plan_id 
  WHERE dp.user_id = '466e81b4-1e2f-4c24-94c2-7d995053bc24'
);

DELETE FROM public.meals 
WHERE daily_plan_id IN (
  SELECT id FROM public.daily_plans 
  WHERE user_id = '466e81b4-1e2f-4c24-94c2-7d995053bc24'
);

DELETE FROM public.daily_plans 
WHERE user_id = '466e81b4-1e2f-4c24-94c2-7d995053bc24';

-- Criar novos alimentos para a dieta
INSERT INTO public.foods (id, name, calories_per_unit, protein_per_unit, carbohydrates_per_unit, fat_per_unit, default_quantity, default_unit, category, user_id, is_custom, fiber_per_unit, sodium_per_unit) VALUES
(gen_random_uuid(), 'Ovo', 77, 6.5, 0.6, 5.5, 2, 'unidade', 'protein', NULL, false, 0, 62),
(gen_random_uuid(), 'Requeijão light', 40, 3.5, 2, 2.5, 30, 'g', 'dairy', NULL, false, 0, 180),
(gen_random_uuid(), 'Creme de ricota light', 45, 4, 2, 3, 30, 'g', 'dairy', NULL, false, 0, 150),
(gen_random_uuid(), 'Queijo Minas', 264, 17.4, 3.8, 20.6, 20, 'g', 'dairy', NULL, false, 0, 346),
(gen_random_uuid(), 'Queijo Mussarela', 280, 18.9, 3.1, 22.2, 15, 'g', 'dairy', NULL, false, 0, 489),
(gen_random_uuid(), 'Goma de tapioca', 83, 0.3, 20.6, 0.1, 20, 'g', 'carbohydrate', NULL, false, 1.6, 1),
(gen_random_uuid(), 'Pão de forma', 253, 7.4, 50.4, 3.1, 1, 'fatia', 'carbohydrate', NULL, false, 3.4, 400),
(gen_random_uuid(), 'Pão francês', 300, 9, 58, 3.1, 0.5, 'unidade', 'carbohydrate', NULL, false, 2.3, 584),
(gen_random_uuid(), 'Biscoito de arroz', 380, 8, 84, 2.8, 3, 'unidade', 'carbohydrate', NULL, false, 1.2, 180),
(gen_random_uuid(), 'Aveia', 394, 13.9, 66.6, 8.5, 20, 'g', 'carbohydrate', NULL, false, 9.1, 5),
(gen_random_uuid(), 'Wrap', 300, 8, 52, 7, 0.5, 'unidade', 'carbohydrate', NULL, false, 3, 520),
(gen_random_uuid(), 'Cuscuz de milho', 112, 2.3, 24.9, 0.5, 60, 'g', 'carbohydrate', NULL, false, 1.2, 39),
(gen_random_uuid(), 'Leite desnatado', 42, 3.4, 5, 0.1, 100, 'ml', 'dairy', NULL, false, 0, 44),
(gen_random_uuid(), 'Leite em pó', 496, 26.4, 38.4, 26.7, 10, 'g', 'dairy', NULL, false, 0, 371),
(gen_random_uuid(), 'Banana', 105, 1.3, 27, 0.4, 75, 'g', 'fruit', NULL, false, 3.1, 1),
(gen_random_uuid(), 'Manga', 60, 0.8, 15.2, 0.4, 100, 'g', 'fruit', NULL, false, 1.6, 1),
(gen_random_uuid(), 'Abacaxi', 50, 0.5, 13.1, 0.1, 150, 'g', 'fruit', NULL, false, 1.4, 1),
(gen_random_uuid(), 'Ameixa', 46, 0.7, 11.4, 0.3, 150, 'g', 'fruit', NULL, false, 1.4, 0),
(gen_random_uuid(), 'Kiwi', 61, 1.1, 14.7, 0.5, 150, 'g', 'fruit', NULL, false, 3, 3),
(gen_random_uuid(), 'Uva', 67, 0.6, 17.2, 0.2, 150, 'g', 'fruit', NULL, false, 0.9, 2),
(gen_random_uuid(), 'Mamão', 43, 0.5, 10.7, 0.1, 200, 'g', 'fruit', NULL, false, 1.7, 8),
(gen_random_uuid(), 'Tangerina', 53, 0.8, 13.3, 0.3, 200, 'g', 'fruit', NULL, false, 1.8, 2),
(gen_random_uuid(), 'Melão', 34, 0.8, 8.2, 0.2, 300, 'g', 'fruit', NULL, false, 0.9, 12),
(gen_random_uuid(), 'Morango', 32, 0.7, 7.7, 0.3, 300, 'g', 'fruit', NULL, false, 2, 1),
(gen_random_uuid(), 'Frango grelhado', 165, 31, 0, 3.6, 120, 'g', 'protein', NULL, false, 0, 74),
(gen_random_uuid(), 'Carne bovina', 250, 26, 0, 15, 120, 'g', 'protein', NULL, false, 0, 65),
(gen_random_uuid(), 'Peixe', 206, 22, 0, 12, 120, 'g', 'protein', NULL, false, 0, 59),
(gen_random_uuid(), 'Arroz integral', 111, 2.6, 22, 0.9, 80, 'g', 'carbohydrate', NULL, false, 1.8, 5),
(gen_random_uuid(), 'Aipim cozido', 125, 1.4, 30, 0.3, 80, 'g', 'carbohydrate', NULL, false, 1.8, 14),
(gen_random_uuid(), 'Macarrão', 131, 5, 25, 1.1, 80, 'g', 'carbohydrate', NULL, false, 1.8, 1),
(gen_random_uuid(), 'Batata doce', 86, 1.6, 20, 0.1, 110, 'g', 'vegetable', NULL, false, 3, 6),
(gen_random_uuid(), 'Batata inglesa', 77, 2, 17, 0.1, 150, 'g', 'vegetable', NULL, false, 2.2, 6),
(gen_random_uuid(), 'Abóbora cabotian', 40, 1.8, 10, 0.1, 180, 'g', 'vegetable', NULL, false, 2.5, 1),
(gen_random_uuid(), 'Feijão cozido', 76, 4.8, 13.6, 0.5, 70, 'g', 'protein', NULL, false, 8.5, 2),
(gen_random_uuid(), 'Lentilha cozida', 93, 8, 16, 0.4, 70, 'g', 'protein', NULL, false, 7.9, 2),
(gen_random_uuid(), 'Grão de bico', 164, 8.9, 27.4, 2.6, 70, 'g', 'protein', NULL, false, 7.6, 7),
(gen_random_uuid(), 'Salada mista', 25, 1.5, 4.5, 0.2, 100, 'g', 'vegetable', NULL, false, 2.5, 15),
(gen_random_uuid(), 'Azeite de oliva', 884, 0, 0, 100, 3, 'g', 'fat', NULL, false, 0, 2),
(gen_random_uuid(), 'Chocolate', 546, 7.6, 59.4, 31.3, 2, 'quadradinho', 'carbohydrate', NULL, false, 7, 24),
(gen_random_uuid(), 'Doce de leite', 315, 7.3, 55.4, 7.5, 18, 'g', 'carbohydrate', NULL, false, 0, 129),
(gen_random_uuid(), 'Whey protein isolado', 413, 90, 0, 1.5, 15, 'g', 'supplement', NULL, false, 0, 250),
(gen_random_uuid(), 'Iogurte natural', 59, 10, 3.6, 0.4, 200, 'g', 'dairy', NULL, false, 0, 36),
(gen_random_uuid(), 'Granola sem açúcar', 471, 13.3, 64.7, 16.9, 10, 'g', 'carbohydrate', NULL, false, 7, 9),
(gen_random_uuid(), 'Chia', 486, 16.5, 42.1, 30.7, 10, 'g', 'supplement', NULL, false, 34.4, 16),
(gen_random_uuid(), 'Linhaça', 495, 14.1, 43.3, 32.3, 10, 'g', 'supplement', NULL, false, 33.5, 9),
(gen_random_uuid(), 'Atum', 116, 26, 0, 1, 50, 'g', 'protein', NULL, false, 0, 354),
(gen_random_uuid(), 'Cottage light', 98, 11, 3.4, 4.3, 30, 'g', 'dairy', NULL, false, 0, 459);

-- Criar novo plano diário
DO $$
DECLARE
    plan_id uuid := gen_random_uuid();
    cafe_id uuid := gen_random_uuid();
    almoco_id uuid := gen_random_uuid();
    sobremesa_id uuid := gen_random_uuid();
    lanche_id uuid := gen_random_uuid();
    jantar_id uuid := gen_random_uuid();
    
    -- IDs dos alimentos
    ovo_id uuid;
    requeijao_id uuid;
    tapioca_id uuid;
    leite_id uuid;
    banana_id uuid;
    frango_id uuid;
    arroz_id uuid;
    feijao_id uuid;
    salada_id uuid;
    azeite_id uuid;
    chocolate_id uuid;
    whey_id uuid;
    iogurte_id uuid;
    aveia_id uuid;
    chia_id uuid;
BEGIN
    -- Buscar IDs dos alimentos
    SELECT id INTO ovo_id FROM public.foods WHERE name = 'Ovo' LIMIT 1;
    SELECT id INTO requeijao_id FROM public.foods WHERE name = 'Requeijão light' LIMIT 1;
    SELECT id INTO tapioca_id FROM public.foods WHERE name = 'Goma de tapioca' LIMIT 1;
    SELECT id INTO leite_id FROM public.foods WHERE name = 'Leite desnatado' LIMIT 1;
    SELECT id INTO banana_id FROM public.foods WHERE name = 'Banana' LIMIT 1;
    SELECT id INTO frango_id FROM public.foods WHERE name = 'Frango grelhado' LIMIT 1;
    SELECT id INTO arroz_id FROM public.foods WHERE name = 'Arroz integral' LIMIT 1;
    SELECT id INTO feijao_id FROM public.foods WHERE name = 'Feijão cozido' LIMIT 1;
    SELECT id INTO salada_id FROM public.foods WHERE name = 'Salada mista' LIMIT 1;
    SELECT id INTO azeite_id FROM public.foods WHERE name = 'Azeite de oliva' LIMIT 1;
    SELECT id INTO chocolate_id FROM public.foods WHERE name = 'Chocolate' LIMIT 1;
    SELECT id INTO whey_id FROM public.foods WHERE name = 'Whey protein isolado' LIMIT 1;
    SELECT id INTO iogurte_id FROM public.foods WHERE name = 'Iogurte natural' LIMIT 1;
    SELECT id INTO aveia_id FROM public.foods WHERE name = 'Aveia' LIMIT 1;
    SELECT id INTO chia_id FROM public.foods WHERE name = 'Chia' LIMIT 1;

    -- Criar plano diário
    INSERT INTO public.daily_plans (id, user_id, date, target_calories) VALUES
    (plan_id, '466e81b4-1e2f-4c24-94c2-7d995053bc24', CURRENT_DATE, 2000);

    -- Criar as refeições
    INSERT INTO public.meals (id, daily_plan_id, name, scheduled_time) VALUES
    (cafe_id, plan_id, 'Café da Manhã', '07:00:00'),
    (almoco_id, plan_id, 'Almoço', '12:00:00'),
    (sobremesa_id, plan_id, 'Sobremesa', '13:00:00'),
    (lanche_id, plan_id, 'Lanche', '15:00:00'),
    (jantar_id, plan_id, 'Jantar', '19:00:00');

    -- CAFÉ DA MANHÃ: Ovo + Requeijão + Tapioca + Leite + Banana
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, ovo_id, 2, 'unidade'),
    (cafe_id, requeijao_id, 30, 'g'),
    (cafe_id, tapioca_id, 20, 'g'),
    (cafe_id, leite_id, 100, 'ml'),
    (cafe_id, banana_id, 75, 'g');

    -- ALMOÇO: Frango + Arroz + Feijão + Salada + Azeite
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, frango_id, 120, 'g'),
    (almoco_id, arroz_id, 80, 'g'),
    (almoco_id, feijao_id, 70, 'g'),
    (almoco_id, salada_id, 100, 'g'),
    (almoco_id, azeite_id, 3, 'g');

    -- SOBREMESA: Chocolate
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (sobremesa_id, chocolate_id, 2, 'quadradinho');

    -- LANCHE: Bowl Proteico (Whey + Iogurte + Aveia + Chia + Banana)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, whey_id, 15, 'g'),
    (lanche_id, iogurte_id, 200, 'g'),
    (lanche_id, aveia_id, 10, 'g'),
    (lanche_id, chia_id, 10, 'g'),
    (lanche_id, banana_id, 100, 'g');

    -- JANTAR: Igual ao almoço
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, frango_id, 120, 'g'),
    (jantar_id, arroz_id, 80, 'g'),
    (jantar_id, feijao_id, 70, 'g'),
    (jantar_id, salada_id, 100, 'g'),
    (jantar_id, azeite_id, 3, 'g');

END $$;