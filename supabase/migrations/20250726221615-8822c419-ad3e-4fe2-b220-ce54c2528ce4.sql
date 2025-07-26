-- Primeiro criar o usuário
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_sent_at,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '466e81b4-1e2f-4c24-94c2-7d995053bc24',
  'authenticated',
  'authenticated',
  'beatrizsantana700@yahoo.com.br',
  '$2a$10$8qVWzfFnGGELV7iCZ/jCz.w/d9VZ4q/cTBU5gXr9wQdqKJ4tI1vgO', -- senha padrão criptografada
  NOW(),
  NOW(),
  '',
  NULL,
  '',
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NULL,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Criar identidade do usuário
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '466e81b4-1e2f-4c24-94c2-7d995053bc24',
  '466e81b4-1e2f-4c24-94c2-7d995053bc24',
  '{"sub": "466e81b4-1e2f-4c24-94c2-7d995053bc24", "email": "beatrizsantana700@yahoo.com.br", "email_verified": true, "phone_verified": false}',
  'email',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (provider_id, provider) DO NOTHING;

-- Gerar UUIDs válidos e inserir alimentos
INSERT INTO public.foods (id, name, calories_per_unit, protein_per_unit, carbohydrates_per_unit, fat_per_unit, default_quantity, default_unit, category, user_id, is_custom, fiber_per_unit, sodium_per_unit) VALUES
(gen_random_uuid(), 'Aveia em Flocos', 68, 2.4, 12, 1.4, 30, 'g', 'carbohydrate', NULL, false, 1.7, 2),
(gen_random_uuid(), 'Banana', 105, 1.3, 27, 0.4, 1, 'unidade', 'fruit', NULL, false, 3.1, 1),
(gen_random_uuid(), 'Leite Desnatado', 42, 3.4, 5, 0.1, 200, 'ml', 'dairy', NULL, false, 0, 44),
(gen_random_uuid(), 'Frango Grelhado', 165, 31, 0, 3.6, 100, 'g', 'protein', NULL, false, 0, 74),
(gen_random_uuid(), 'Arroz Integral', 111, 2.6, 22, 0.9, 50, 'g', 'carbohydrate', NULL, false, 1.8, 5),
(gen_random_uuid(), 'Brócolis', 25, 3, 5, 0.4, 100, 'g', 'vegetable', NULL, false, 2.6, 33),
(gen_random_uuid(), 'Azeite de Oliva', 884, 0, 0, 100, 1, 'colher de sopa', 'fat', NULL, false, 0, 2),
(gen_random_uuid(), 'Batata Doce', 86, 1.6, 20, 0.1, 100, 'g', 'vegetable', NULL, false, 3, 6),
(gen_random_uuid(), 'Ovos', 155, 13, 1.1, 11, 2, 'unidade', 'protein', NULL, false, 0, 124),
(gen_random_uuid(), 'Iogurte Natural', 59, 10, 3.6, 0.4, 150, 'g', 'dairy', NULL, false, 0, 36);

-- Criar plano diário para a usuária
DO $$
DECLARE
    plan_id uuid := gen_random_uuid();
    meal1_id uuid := gen_random_uuid();
    meal2_id uuid := gen_random_uuid();
    meal3_id uuid := gen_random_uuid();
    meal4_id uuid := gen_random_uuid();
    meal5_id uuid := gen_random_uuid();
    aveia_id uuid;
    banana_id uuid;
    leite_id uuid;
    frango_id uuid;
    arroz_id uuid;
    brocolis_id uuid;
    azeite_id uuid;
    batata_id uuid;
    ovos_id uuid;
    iogurte_id uuid;
BEGIN
    -- Buscar IDs dos alimentos recém criados
    SELECT id INTO aveia_id FROM public.foods WHERE name = 'Aveia em Flocos' LIMIT 1;
    SELECT id INTO banana_id FROM public.foods WHERE name = 'Banana' LIMIT 1;
    SELECT id INTO leite_id FROM public.foods WHERE name = 'Leite Desnatado' LIMIT 1;
    SELECT id INTO frango_id FROM public.foods WHERE name = 'Frango Grelhado' LIMIT 1;
    SELECT id INTO arroz_id FROM public.foods WHERE name = 'Arroz Integral' LIMIT 1;
    SELECT id INTO brocolis_id FROM public.foods WHERE name = 'Brócolis' LIMIT 1;
    SELECT id INTO azeite_id FROM public.foods WHERE name = 'Azeite de Oliva' LIMIT 1;
    SELECT id INTO batata_id FROM public.foods WHERE name = 'Batata Doce' LIMIT 1;
    SELECT id INTO ovos_id FROM public.foods WHERE name = 'Ovos' LIMIT 1;
    SELECT id INTO iogurte_id FROM public.foods WHERE name = 'Iogurte Natural' LIMIT 1;

    -- Criar plano diário
    INSERT INTO public.daily_plans (id, user_id, date, target_calories) VALUES
    (plan_id, '466e81b4-1e2f-4c24-94c2-7d995053bc24', CURRENT_DATE, 1800);

    -- Criar as refeições
    INSERT INTO public.meals (id, daily_plan_id, name, scheduled_time) VALUES
    (meal1_id, plan_id, 'Café da Manhã', '07:00:00'),
    (meal2_id, plan_id, 'Almoço', '12:00:00'),
    (meal3_id, plan_id, 'Lanche da Tarde', '15:00:00'),
    (meal4_id, plan_id, 'Jantar', '19:00:00'),
    (meal5_id, plan_id, 'Ceia', '21:00:00');

    -- Adicionar alimentos às refeições
    -- Café da Manhã
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal1_id, aveia_id, 30, 'g'),
    (meal1_id, banana_id, 1, 'unidade'),
    (meal1_id, leite_id, 200, 'ml');

    -- Almoço
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal2_id, frango_id, 120, 'g'),
    (meal2_id, arroz_id, 80, 'g'),
    (meal2_id, brocolis_id, 100, 'g'),
    (meal2_id, azeite_id, 1, 'colher de sopa');

    -- Lanche da Tarde
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal3_id, iogurte_id, 150, 'g'),
    (meal3_id, banana_id, 1, 'unidade');

    -- Jantar
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal4_id, ovos_id, 2, 'unidade'),
    (meal4_id, batata_id, 150, 'g'),
    (meal4_id, brocolis_id, 80, 'g');

    -- Ceia
    INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
    (meal5_id, leite_id, 150, 'ml');
END $$;