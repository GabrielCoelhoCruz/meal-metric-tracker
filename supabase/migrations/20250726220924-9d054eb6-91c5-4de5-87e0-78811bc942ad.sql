-- Criar plano de dieta para beatrizsantana700@yahoo.com.br - UUIDs corrigidos
-- Primeiro vamos verificar se os alimentos existem e criar os que faltam

-- Inserir alimentos que não existem no banco (se não existirem)
INSERT INTO public.foods (id, name, category, calories_per_unit, carbohydrates_per_unit, protein_per_unit, fat_per_unit, default_unit, default_quantity, is_custom, user_id) VALUES
-- Requeijão light
('550e4c7e-9b12-4a5b-8f3d-1a2b3c4d5e6f', 'Requeijão light', 'dairy', 1.5, 0.5, 1.8, 0.8, 'g', 10, false, null),
-- Creme de ricota de búfala  
('660f5d8e-ac23-5b6c-9f4e-2b3c4d5e6f7g', 'Creme de ricota de búfala', 'dairy', 1.2, 0.3, 2.1, 0.6, 'g', 10, false, null),
-- Queijo Minas
('770f6e9f-bd34-6c7d-af5f-3c4d5e6f7f8h', 'Queijo Minas', 'dairy', 2.8, 0.1, 2.5, 2.0, 'g', 10, false, null),
-- Queijo Mussarela
('880f7faf-ce45-7d8e-bf6f-4d5e6f7f8f9i', 'Queijo Mussarela', 'dairy', 3.2, 0.2, 2.8, 2.4, 'g', 10, false, null),
-- Goma de tapioca
('990f8fbf-df56-8e9f-cf7f-5e6f7f8f9f0j', 'Goma de tapioca', 'carbohydrate', 3.6, 0.9, 0.0, 0.0, 'g', 10, false, null),
-- Biscoito de arroz grande
('aa0f9fcf-ef67-9f0f-df8f-6f7f8f9f0f1k', 'Biscoito de arroz grande', 'carbohydrate', 17.0, 3.4, 0.8, 0.3, 'unidade', 1, false, null),
-- Biscoito de arroz pequeno
('bb1f0fdf-ff78-0f1f-ef9f-7f8f9f0f1f2l', 'Biscoito de arroz pequeno', 'carbohydrate', 4.2, 0.8, 0.2, 0.1, 'unidade', 1, false, null),
-- Wrap
('cc2f1fef-0f89-1f2f-ff0f-8f9f0f1f2f3m', 'Wrap', 'carbohydrate', 150, 30, 5, 3, 'unidade', 1, false, null),
-- Cuscuz de milho cozido
('dd3f2fff-1f90-2f3f-0f1f-9f0f1f2f3f4n', 'Cuscuz de milho cozido', 'carbohydrate', 1.1, 0.25, 0.03, 0.01, 'g', 10, false, null),
-- Leite em pó desnatado
('ee4f3f0f-2f01-3f4f-1f2f-0f1f2f3f4f5o', 'Leite em pó desnatado', 'dairy', 3.5, 0.52, 0.36, 0.01, 'g', 1, false, null),
-- Manga
('ff5f4f1f-3f12-4f5f-2f3f-1f2f3f4f5f6p', 'Manga', 'fruit', 0.6, 0.15, 0.008, 0.003, 'g', 1, false, null),
-- Abacaxi
('005f5f2f-4f23-5f6f-3f4f-2f3f4f5f6f7q', 'Abacaxi', 'fruit', 0.5, 0.13, 0.005, 0.001, 'g', 1, false, null),
-- Ameixa
('115f6f3f-5f34-6f7f-4f5f-3f4f5f6f7f8r', 'Ameixa', 'fruit', 0.46, 0.11, 0.007, 0.003, 'g', 1, false, null),
-- Kiwi
('225f7f4f-6f45-7f8f-5f6f-4f5f6f7f8f9s', 'Kiwi', 'fruit', 0.61, 0.15, 0.011, 0.005, 'g', 1, false, null),
-- Mirtilo/Blueberry
('335f8f5f-7f56-8f9f-6f7f-5f6f7f8f9f0t', 'Mirtilo', 'fruit', 0.57, 0.14, 0.007, 0.003, 'g', 1, false, null),
-- Uva
('445f9f6f-8f67-9f0f-7f8f-6f7f8f9f0f1u', 'Uva', 'fruit', 0.67, 0.17, 0.006, 0.002, 'g', 1, false, null),
-- Tangerina
('555f0f7f-9f78-0f1f-8f9f-7f8f9f0f1f2v', 'Tangerina', 'fruit', 0.53, 0.13, 0.008, 0.003, 'g', 1, false, null),
-- Pitaia
('665f1f8f-0f89-1f2f-9f0f-8f9f0f1f2f3w', 'Pitaia', 'fruit', 0.6, 0.11, 0.012, 0.004, 'g', 1, false, null),
-- Melão
('775f2f9f-1f90-2f3f-0f1f-9f0f1f2f3f4x', 'Melão', 'fruit', 0.34, 0.08, 0.008, 0.002, 'g', 1, false, null),
-- Morango
('885f3f0f-2f01-3f4f-1f2f-0f1f2f3f4f5y', 'Morango', 'fruit', 0.32, 0.077, 0.007, 0.003, 'g', 1, false, null),
-- Chocolate (por quadradinho)
('995f4f1f-3f12-4f5f-2f3f-1f2f3f4f5f6z', 'Chocolate', 'supplement', 27, 3, 1.5, 1.8, 'quadradinho', 1, false, null),
-- Doce de leite
('005f5f2f-4f23-5f6f-3f4f-2f3f4f5f6f7a', 'Doce de leite', 'supplement', 3.1, 0.55, 0.07, 0.08, 'g', 1, false, null),
-- Whey protein isolado
('115f6f3f-5f34-6f7f-4f5f-3f4f5f6f7f8b', 'Whey protein isolado', 'protein', 25, 1, 6, 0.2, 'g', 1, false, null),
-- Iogurte natural Pense Zero
('225f7f4f-6f45-7f8f-5f6f-4f5f6f7f8f9c', 'Iogurte natural Pense Zero', 'dairy', 0.55, 0.08, 0.09, 0.01, 'g', 1, false, null),
-- Granola sem açúcar
('335f8f5f-7f56-8f9f-6f7f-5f6f7f8f9f0d', 'Granola sem açúcar', 'carbohydrate', 4.7, 0.6, 0.13, 0.2, 'g', 1, false, null),
-- Sementes de chia
('445f9f6f-8f67-9f0f-7f8f-6f7f8f9f0f1e', 'Sementes de chia', 'fat', 4.9, 0.42, 0.17, 0.31, 'g', 1, false, null),
-- Sementes de linhaça
('555f0f7f-9f78-0f1f-8f9f-7f8f9f0f1f2f', 'Sementes de linhaça', 'fat', 5.3, 0.29, 0.18, 0.42, 'g', 1, false, null),
-- Frango desfiado
('665f1f8f-0f89-1f2f-9f0f-8f9f0f1f2f3g', 'Frango desfiado', 'protein', 1.65, 0, 0.31, 0.036, 'g', 1, false, null),
-- Atum
('775f2f9f-1f90-2f3f-0f1f-9f0f1f2f3f4h', 'Atum', 'protein', 1.44, 0, 0.3, 0.035, 'g', 1, false, null),
-- Cottage
('885f3f0f-2f01-3f4f-1f2f-0f1f2f3f4f5i', 'Cottage', 'dairy', 0.98, 0.033, 0.11, 0.043, 'g', 1, false, null),
-- Proteína (genérica para carnes)
('995f4f1f-3f12-4f5f-2f3f-1f2f3f4f5f6j', 'Proteína (carne/peixe)', 'protein', 2.5, 0, 0.25, 0.15, 'g', 1, false, null),
-- Carboidrato (arroz/aipim/macarrão)
('115f5f2f-4f23-5f6f-3f4f-2f3f4f5f6f7k', 'Carboidrato (arroz/aipim/macarrão)', 'carbohydrate', 1.3, 0.28, 0.025, 0.003, 'g', 1, false, null),
-- Batata baroa cozida
('225f6f3f-5f34-6f7f-4f5f-3f4f5f6f7f8l', 'Batata baroa cozida', 'carbohydrate', 0.96, 0.22, 0.015, 0.001, 'g', 1, false, null),
-- Batata inglesa cozida
('335f7f4f-6f45-7f8f-5f6f-4f5f6f7f8f9m', 'Batata inglesa cozida', 'carbohydrate', 0.86, 0.2, 0.018, 0.001, 'g', 1, false, null),
-- Abóbora cabotian cozida
('445f8f5f-7f56-8f9f-6f7f-5f6f7f8f9f0n', 'Abóbora cabotian cozida', 'vegetable', 0.4, 0.1, 0.012, 0.001, 'g', 1, false, null),
-- Leguminosas (feijão/lentilha/grão de bico/ervilha)
('555f9f6f-8f67-9f0f-7f8f-6f7f8f9f0f1o', 'Leguminosas', 'protein', 1.43, 0.25, 0.09, 0.005, 'g', 1, false, null),
-- Salada (legumes e folhosos)
('665f0f7f-9f78-0f1f-8f9f-7f8f9f0f1f2p', 'Salada', 'vegetable', 0.2, 0.04, 0.02, 0.001, 'g', 1, false, null),
-- Azeite
('775f1f8f-0f89-1f2f-9f0f-8f9f0f1f2f3q', 'Azeite', 'fat', 8.84, 0, 0, 1, 'g', 1, false, null)
ON CONFLICT (id) DO NOTHING;

-- Criar um usuário temporário para o plano (será substituído quando a conta for criada)
-- Este é um UUID fixo que será usado até a conta real ser criada
DO $$
DECLARE
    temp_user_id uuid := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    plan_id uuid;
    cafe_id uuid;
    almoco_id uuid;
    sobremesa_id uuid;
    lanche_id uuid;
    jantar_id uuid;
BEGIN
    -- Criar plano diário para hoje
    INSERT INTO public.daily_plans (id, user_id, date, target_calories)
    VALUES (gen_random_uuid(), temp_user_id, CURRENT_DATE, 1800)
    RETURNING id INTO plan_id;

    -- Criar refeições
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Café da manhã', '07:00:00') RETURNING id INTO cafe_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Almoço', '12:00:00') RETURNING id INTO almoco_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Sobremesa', '14:00:00') RETURNING id INTO sobremesa_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Lanche', '16:00:00') RETURNING id INTO lanche_id;
    
    INSERT INTO public.meals (daily_plan_id, name, scheduled_time) VALUES
    (plan_id, 'Jantar', '19:00:00') RETURNING id INTO jantar_id;

    -- CAFÉ DA MANHÃ - Alimentos base + opções de troca
    -- Ovo (base)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, '75185daf-c18d-4ca2-aee2-328062960dca', 2, 'unidade');
    
    -- Opções de queijo/requeijão (primeira opção como base)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, '550e4c7e-9b12-4a5b-8f3d-1a2b3c4d5e6f', 30, 'g');
    
    -- Opções de carboidrato (primeira opção como base)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, '990f8fbf-df56-8e9f-cf7f-5e6f7f8f9f0j', 20, 'g');
    
    -- Leite (primeira opção como base)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, 'ee4f3f0f-2f01-3f4f-1f2f-0f1f2f3f4f5o', 10, 'g');
    
    -- Fruta (primeira opção como base)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 75, 'g');

    -- ALMOÇO
    -- Proteína
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, '995f4f1f-3f12-4f5f-2f3f-1f2f3f4f5f6j', 120, 'g');
    
    -- Carboidrato
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, '115f5f2f-4f23-5f6f-3f4f-2f3f4f5f6f7k', 80, 'g');
    
    -- Leguminosas
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, '555f9f6f-8f67-9f0f-7f8f-6f7f8f9f0f1o', 70, 'g');
    
    -- Salada
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, '665f0f7f-9f78-0f1f-8f9f-7f8f9f0f1f2p', 100, 'g');
    
    -- Azeite
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, '775f1f8f-0f89-1f2f-9f0f-8f9f0f1f2f3q', 3, 'g');

    -- SOBREMESA - Opção 1 (fruta)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (sobremesa_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 75, 'g');

    -- LANCHE - Opção 1 (Bowl proteico)
    -- Whey protein
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, '115f6f3f-5f34-6f7f-4f5f-3f4f5f6f7f8b', 15, 'g');
    
    -- Iogurte
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, '225f7f4f-6f45-7f8f-5f6f-4f5f6f7f8f9c', 200, 'g');
    
    -- Aveia/Granola
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, '335f8f5f-7f56-8f9f-6f7f-5f6f7f8f9f0d', 10, 'g');
    
    -- Sementes
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, '445f9f6f-8f67-9f0f-7f8f-6f7f8f9f0f1e', 10, 'g');
    
    -- Fruta
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 100, 'g');

    -- JANTAR - Opção 1 (similar ao almoço)
    -- Proteína
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, '995f4f1f-3f12-4f5f-2f3f-1f2f3f4f5f6j', 120, 'g');
    
    -- Carboidrato
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, '115f5f2f-4f23-5f6f-3f4f-2f3f4f5f6f7k', 80, 'g');
    
    -- Leguminosas
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, '555f9f6f-8f67-9f0f-7f8f-6f7f8f9f0f1o', 70, 'g');
    
    -- Salada
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, '665f0f7f-9f78-0f1f-8f9f-7f8f9f0f1f2p', 100, 'g');
    
    -- Azeite
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, '775f1f8f-0f89-1f2f-9f0f-8f9f0f1f2f3q', 3, 'g');

END $$;