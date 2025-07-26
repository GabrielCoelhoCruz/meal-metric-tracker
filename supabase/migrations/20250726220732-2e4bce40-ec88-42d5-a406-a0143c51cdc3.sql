-- Criar plano de dieta para beatrizsantana700@yahoo.com.br
-- Primeiro vamos verificar se os alimentos existem e criar os que faltam

-- Inserir alimentos que não existem no banco (se não existirem)
INSERT INTO public.foods (id, name, category, calories_per_unit, carbohydrates_per_unit, protein_per_unit, fat_per_unit, default_unit, default_quantity, is_custom, user_id) VALUES
-- Requeijão light
('550e4c7e-9b12-4a5b-8f3d-1a2b3c4d5e6f', 'Requeijão light', 'dairy', 1.5, 0.5, 1.8, 0.8, 'g', 10, false, null),
-- Creme de ricota de búfala  
('660f5d8e-ac23-5b6c-9g4e-2b3c4d5e6f7g', 'Creme de ricota de búfala', 'dairy', 1.2, 0.3, 2.1, 0.6, 'g', 10, false, null),
-- Queijo Minas
('770g6e9f-bd34-6c7d-ah5f-3c4d5e6f7g8h', 'Queijo Minas', 'dairy', 2.8, 0.1, 2.5, 2.0, 'g', 10, false, null),
-- Queijo Mussarela
('880h7fag-ce45-7d8e-bi6g-4d5e6f7g8h9i', 'Queijo Mussarela', 'dairy', 3.2, 0.2, 2.8, 2.4, 'g', 10, false, null),
-- Goma de tapioca
('990i8gbh-df56-8e9f-cj7h-5e6f7g8h9i0j', 'Goma de tapioca', 'carbohydrate', 3.6, 0.9, 0.0, 0.0, 'g', 10, false, null),
-- Biscoito de arroz grande
('aa0j9hci-eg67-9f0g-dk8i-6f7g8h9i0j1k', 'Biscoito de arroz grande', 'carbohydrate', 17.0, 3.4, 0.8, 0.3, 'unidade', 1, false, null),
-- Biscoito de arroz pequeno
('bb1k0idj-fh78-0g1h-el9j-7g8h9i0j1k2l', 'Biscoito de arroz pequeno', 'carbohydrate', 4.2, 0.8, 0.2, 0.1, 'unidade', 1, false, null),
-- Wrap
('cc2l1jek-gi89-1h2i-fm0k-8h9i0j1k2l3m', 'Wrap', 'carbohydrate', 150, 30, 5, 3, 'unidade', 1, false, null),
-- Cuscuz de milho cozido
('dd3m2kfl-hj90-2i3j-gn1l-9i0j1k2l3m4n', 'Cuscuz de milho cozido', 'carbohydrate', 1.1, 0.25, 0.03, 0.01, 'g', 10, false, null),
-- Leite em pó desnatado
('ee4n3lgm-ik01-3j4k-ho2m-0j1k2l3m4n5o', 'Leite em pó desnatado', 'dairy', 3.5, 0.52, 0.36, 0.01, 'g', 1, false, null),
-- Manga
('ff5o4mhn-jl12-4k5l-ip3n-1k2l3m4n5o6p', 'Manga', 'fruit', 0.6, 0.15, 0.008, 0.003, 'g', 1, false, null),
-- Abacaxi
('gg6p5nio-km23-5l6m-jq4o-2l3m4n5o6p7q', 'Abacaxi', 'fruit', 0.5, 0.13, 0.005, 0.001, 'g', 1, false, null),
-- Ameixa
('hh7q6ojp-ln34-6m7n-kr5p-3m4n5o6p7q8r', 'Ameixa', 'fruit', 0.46, 0.11, 0.007, 0.003, 'g', 1, false, null),
-- Kiwi
('ii8r7pkq-mo45-7n8o-ls6q-4n5o6p7q8r9s', 'Kiwi', 'fruit', 0.61, 0.15, 0.011, 0.005, 'g', 1, false, null),
-- Mirtilo/Blueberry
('jj9s8qlr-np56-8o9p-mt7r-5o6p7q8r9s0t', 'Mirtilo', 'fruit', 0.57, 0.14, 0.007, 0.003, 'g', 1, false, null),
-- Uva
('kk0t9rms-oq67-9p0q-nu8s-6p7q8r9s0t1u', 'Uva', 'fruit', 0.67, 0.17, 0.006, 0.002, 'g', 1, false, null),
-- Tangerina
('ll1u0snt-pr78-0q1r-ov9t-7q8r9s0t1u2v', 'Tangerina', 'fruit', 0.53, 0.13, 0.008, 0.003, 'g', 1, false, null),
-- Pitaia
('mm2v1tou-qs89-1r2s-pw0u-8r9s0t1u2v3w', 'Pitaia', 'fruit', 0.6, 0.11, 0.012, 0.004, 'g', 1, false, null),
-- Melão
('nn3w2upv-rt90-2s3t-qx1v-9s0t1u2v3w4x', 'Melão', 'fruit', 0.34, 0.08, 0.008, 0.002, 'g', 1, false, null),
-- Morango
('oo4x3vqw-su01-3t4u-ry2w-0t1u2v3w4x5y', 'Morango', 'fruit', 0.32, 0.077, 0.007, 0.003, 'g', 1, false, null),
-- Chocolate (por quadradinho)
('pp5y4wrx-tv12-4u5v-sz3x-1u2v3w4x5y6z', 'Chocolate', 'supplement', 27, 3, 1.5, 1.8, 'quadradinho', 1, false, null),
-- Doce de leite
('qq6z5xsy-uw23-5v6w-ta4y-2v3w4x5y6z7a', 'Doce de leite', 'supplement', 3.1, 0.55, 0.07, 0.08, 'g', 1, false, null),
-- Whey protein isolado
('rr7a6ytz-vx34-6w7x-ub5z-3w4x5y6z7a8b', 'Whey protein isolado', 'protein', 25, 1, 6, 0.2, 'g', 1, false, null),
-- Iogurte natural Pense Zero
('ss8b7zua-wy45-7x8y-vc6a-4x5y6z7a8b9c', 'Iogurte natural Pense Zero', 'dairy', 0.55, 0.08, 0.09, 0.01, 'g', 1, false, null),
-- Granola sem açúcar
('tt9c8avb-xz56-8y9z-wd7b-5y6z7a8b9c0d', 'Granola sem açúcar', 'carbohydrate', 4.7, 0.6, 0.13, 0.2, 'g', 1, false, null),
-- Sementes de chia
('uu0d9bwc-ya67-9z0a-xe8c-6z7a8b9c0d1e', 'Sementes de chia', 'fat', 4.9, 0.42, 0.17, 0.31, 'g', 1, false, null),
-- Sementes de linhaça
('vv1e0cxd-zb78-0a1b-yf9d-7a8b9c0d1e2f', 'Sementes de linhaça', 'fat', 5.3, 0.29, 0.18, 0.42, 'g', 1, false, null),
-- Frango desfiado
('ww2f1dye-ac89-1b2c-zg0e-8b9c0d1e2f3g', 'Frango desfiado', 'protein', 1.65, 0, 0.31, 0.036, 'g', 1, false, null),
-- Atum
('xx3g2ezf-bd90-2c3d-ah1f-9c0d1e2f3g4h', 'Atum', 'protein', 1.44, 0, 0.3, 0.035, 'g', 1, false, null),
-- Cottage
('yy4h3fag-ce01-3d4e-bi2g-0d1e2f3g4h5i', 'Cottage', 'dairy', 0.98, 0.033, 0.11, 0.043, 'g', 1, false, null),
-- Proteína (genérica para carnes)
('zz5i4gbh-df12-4e5f-cj3h-1e2f3g4h5i6j', 'Proteína (carne/peixe)', 'protein', 2.5, 0, 0.25, 0.15, 'g', 1, false, null),
-- Carboidrato (arroz/aipim/macarrão)
('aa6j5hci-eg23-5f6g-dk4i-2f3g4h5i6j7k', 'Carboidrato (arroz/aipim/macarrão)', 'carbohydrate', 1.3, 0.28, 0.025, 0.003, 'g', 1, false, null),
-- Batata baroa cozida
('bb7k6idj-fh34-6g7h-el5j-3g4h5i6j7k8l', 'Batata baroa cozida', 'carbohydrate', 0.96, 0.22, 0.015, 0.001, 'g', 1, false, null),
-- Batata inglesa cozida
('cc8l7jek-gi45-7h8i-fm6k-4h5i6j7k8l9m', 'Batata inglesa cozida', 'carbohydrate', 0.86, 0.2, 0.018, 0.001, 'g', 1, false, null),
-- Abóbora cabotian cozida
('dd9m8kfl-hj56-8i9j-gn7l-5i6j7k8l9m0n', 'Abóbora cabotian cozida', 'vegetable', 0.4, 0.1, 0.012, 0.001, 'g', 1, false, null),
-- Leguminosas (feijão/lentilha/grão de bico/ervilha)
('ee0n9lgm-ik67-9j0k-ho8m-6j7k8l9m0n1o', 'Leguminosas', 'protein', 1.43, 0.25, 0.09, 0.005, 'g', 1, false, null),
-- Salada (legumes e folhosos)
('ff1o0mhn-jl78-0k1l-ip9n-7k8l9m0n1o2p', 'Salada', 'vegetable', 0.2, 0.04, 0.02, 0.001, 'g', 1, false, null),
-- Azeite
('gg2p1nio-km89-1l2m-jq0o-8l9m0n1o2p3q', 'Azeite', 'fat', 8.84, 0, 0, 1, 'g', 1, false, null)
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
    (cafe_id, '990i8gbh-df56-8e9f-cj7h-5e6f7g8h9i0j', 20, 'g');
    
    -- Leite (primeira opção como base)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, 'ee4n3lgm-ik01-3j4k-ho2m-0j1k2l3m4n5o', 10, 'g');
    
    -- Fruta (primeira opção como base)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (cafe_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 75, 'g');

    -- ALMOÇO
    -- Proteína
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, 'zz5i4gbh-df12-4e5f-cj3h-1e2f3g4h5i6j', 120, 'g');
    
    -- Carboidrato
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, 'aa6j5hci-eg23-5f6g-dk4i-2f3g4h5i6j7k', 80, 'g');
    
    -- Leguminosas
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, 'ee0n9lgm-ik67-9j0k-ho8m-6j7k8l9m0n1o', 70, 'g');
    
    -- Salada
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, 'ff1o0mhn-jl78-0k1l-ip9n-7k8l9m0n1o2p', 100, 'g');
    
    -- Azeite
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (almoco_id, 'gg2p1nio-km89-1l2m-jq0o-8l9m0n1o2p3q', 3, 'g');

    -- SOBREMESA - Opção 1 (fruta)
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (sobremesa_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 75, 'g');

    -- LANCHE - Opção 1 (Bowl proteico)
    -- Whey protein
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, 'rr7a6ytz-vx34-6w7x-ub5z-3w4x5y6z7a8b', 15, 'g');
    
    -- Iogurte
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, 'ss8b7zua-wy45-7x8y-vc6a-4x5y6z7a8b9c', 200, 'g');
    
    -- Aveia/Granola
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, 'tt9c8avb-xz56-8y9z-wd7b-5y6z7a8b9c0d', 10, 'g');
    
    -- Sementes
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, 'uu0d9bwc-ya67-9z0a-xe8c-6z7a8b9c0d1e', 10, 'g');
    
    -- Fruta
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (lanche_id, '6d4194b8-2003-492b-b68d-70f05e3140a0', 100, 'g');

    -- JANTAR - Opção 1 (similar ao almoço)
    -- Proteína
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, 'zz5i4gbh-df12-4e5f-cj3h-1e2f3g4h5i6j', 120, 'g');
    
    -- Carboidrato
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, 'aa6j5hci-eg23-5f6g-dk4i-2f3g4h5i6j7k', 80, 'g');
    
    -- Leguminosas
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, 'ee0n9lgm-ik67-9j0k-ho8m-6j7k8l9m0n1o', 70, 'g');
    
    -- Salada
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, 'ff1o0mhn-jl78-0k1l-ip9n-7k8l9m0n1o2p', 100, 'g');
    
    -- Azeite
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (jantar_id, 'gg2p1nio-km89-1l2m-jq0o-8l9m0n1o2p3q', 3, 'g');

END $$;