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

-- Agora inserir os alimentos base (usando categorias válidas: protein, carbohydrate, fruit, vegetable, dairy, fat, supplement)
INSERT INTO public.foods (id, name, calories_per_unit, protein_per_unit, carbohydrates_per_unit, fat_per_unit, default_quantity, default_unit, category, user_id, is_custom, fiber_per_unit, sodium_per_unit) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Aveia em Flocos', 68, 2.4, 12, 1.4, 30, 'g', 'carbohydrate', NULL, false, 1.7, 2),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Banana', 105, 1.3, 27, 0.4, 1, 'unidade', 'fruit', NULL, false, 3.1, 1),
('c3d4e5f6-g7h8-9012-cdef-345678901234', 'Leite Desnatado', 42, 3.4, 5, 0.1, 200, 'ml', 'dairy', NULL, false, 0, 44),
('d4e5f6g7-h8i9-0123-defg-456789012345', 'Frango Grelhado', 165, 31, 0, 3.6, 100, 'g', 'protein', NULL, false, 0, 74),
('e5f6g7h8-i9j0-1234-efgh-567890123456', 'Arroz Integral', 111, 2.6, 22, 0.9, 50, 'g', 'carbohydrate', NULL, false, 1.8, 5),
('f6g7h8i9-j0k1-2345-fghi-678901234567', 'Brócolis', 25, 3, 5, 0.4, 100, 'g', 'vegetable', NULL, false, 2.6, 33),
('g7h8i9j0-k1l2-3456-ghij-789012345678', 'Azeite de Oliva', 884, 0, 0, 100, 1, 'colher de sopa', 'fat', NULL, false, 0, 2),
('h8i9j0k1-l2m3-4567-hijk-890123456789', 'Batata Doce', 86, 1.6, 20, 0.1, 100, 'g', 'vegetable', NULL, false, 3, 6),
('i9j0k1l2-m3n4-5678-ijkl-901234567890', 'Ovos', 155, 13, 1.1, 11, 2, 'unidade', 'protein', NULL, false, 0, 124),
('j0k1l2m3-n4o5-6789-jklm-012345678901', 'Iogurte Natural', 59, 10, 3.6, 0.4, 150, 'g', 'dairy', NULL, false, 0, 36);

-- Criar plano diário para a usuária
INSERT INTO public.daily_plans (id, user_id, date, target_calories) VALUES
('11111111-2222-3333-4444-555555555555', '466e81b4-1e2f-4c24-94c2-7d995053bc24', CURRENT_DATE, 1800);

-- Criar as refeições
INSERT INTO public.meals (id, daily_plan_id, name, scheduled_time) VALUES
('22222222-3333-4444-5555-666666666666', '11111111-2222-3333-4444-555555555555', 'Café da Manhã', '07:00:00'),
('33333333-4444-5555-6666-777777777777', '11111111-2222-3333-4444-555555555555', 'Almoço', '12:00:00'),
('44444444-5555-6666-7777-888888888888', '11111111-2222-3333-4444-555555555555', 'Lanche da Tarde', '15:00:00'),
('55555555-6666-7777-8888-999999999999', '11111111-2222-3333-4444-555555555555', 'Jantar', '19:00:00'),
('66666666-7777-8888-9999-aaaaaaaaaaaa', '11111111-2222-3333-4444-555555555555', 'Ceia', '21:00:00');

-- Adicionar alimentos às refeições
-- Café da Manhã
INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
('22222222-3333-4444-5555-666666666666', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 30, 'g'),
('22222222-3333-4444-5555-666666666666', 'b2c3d4e5-f6g7-8901-bcde-f23456789012', 1, 'unidade'),
('22222222-3333-4444-5555-666666666666', 'c3d4e5f6-g7h8-9012-cdef-345678901234', 200, 'ml');

-- Almoço
INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
('33333333-4444-5555-6666-777777777777', 'd4e5f6g7-h8i9-0123-defg-456789012345', 120, 'g'),
('33333333-4444-5555-6666-777777777777', 'e5f6g7h8-i9j0-1234-efgh-567890123456', 80, 'g'),
('33333333-4444-5555-6666-777777777777', 'f6g7h8i9-j0k1-2345-fghi-678901234567', 100, 'g'),
('33333333-4444-5555-6666-777777777777', 'g7h8i9j0-k1l2-3456-ghij-789012345678', 1, 'colher de sopa');

-- Lanche da Tarde
INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
('44444444-5555-6666-7777-888888888888', 'j0k1l2m3-n4o5-6789-jklm-012345678901', 150, 'g'),
('44444444-5555-6666-7777-888888888888', 'b2c3d4e5-f6g7-8901-bcde-f23456789012', 1, 'unidade');

-- Jantar
INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
('55555555-6666-7777-8888-999999999999', 'i9j0k1l2-m3n4-5678-ijkl-901234567890', 2, 'unidade'),
('55555555-6666-7777-8888-999999999999', 'h8i9j0k1-l2m3-4567-hijk-890123456789', 150, 'g'),
('55555555-6666-7777-8888-999999999999', 'f6g7h8i9-j0k1-2345-fghi-678901234567', 80, 'g');

-- Ceia
INSERT INTO public.meal_foods (meal_id, food_id, quantity, unit) VALUES
('66666666-7777-8888-9999-aaaaaaaaaaaa', 'c3d4e5f6-g7h8-9012-cdef-345678901234', 150, 'ml');