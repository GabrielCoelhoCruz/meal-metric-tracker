-- Atualização dos valores nutricionais baseados na TACO 4
-- Todos os valores são por 100g conforme tabela oficial

-- BANANA PRATA (TACO 4: 89 kcal/100g)
UPDATE public.foods 
SET 
  calories_per_unit = 0.89,
  carbohydrates_per_unit = 0.238,
  protein_per_unit = 0.013,
  fat_per_unit = 0.001,
  fiber_per_unit = 0.019,
  sodium_per_unit = 0.0,
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = '6d4194b8-2003-492b-b68d-70f05e3140a0';

-- OVOS DE GALINHA INTEIROS (TACO 4: 147 kcal/100g)
UPDATE public.foods 
SET 
  calories_per_unit = 1.47,
  carbohydrates_per_unit = 0.006,
  protein_per_unit = 0.126,
  fat_per_unit = 0.103,
  fiber_per_unit = 0.0,
  sodium_per_unit = 0.130,
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = '75185daf-c18d-4ca2-aee2-328062960dca';

-- PÃO FRANCÊS (TACO 4: 300 kcal/100g)
UPDATE public.foods 
SET 
  calories_per_unit = 3.00,
  carbohydrates_per_unit = 0.586,
  protein_per_unit = 0.080,
  fat_per_unit = 0.031,
  fiber_per_unit = 0.023,
  sodium_per_unit = 0.659,
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = '02936f67-d2f8-488f-b1c7-ba2f7f117456';

-- FRANGO PEITO SEM PELE CRU (TACO 4: 159 kcal/100g)
UPDATE public.foods 
SET 
  calories_per_unit = 1.59,
  carbohydrates_per_unit = 0.0,
  protein_per_unit = 0.328,
  fat_per_unit = 0.029,
  fiber_per_unit = 0.0,
  sodium_per_unit = 0.077,
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = '6107c9d5-4ba8-4441-a7e6-4fa7eaf26472';

-- ARROZ BRANCO COZIDO (TACO 4: 128 kcal/100g)
UPDATE public.foods 
SET 
  calories_per_unit = 1.28,
  carbohydrates_per_unit = 0.258,
  protein_per_unit = 0.025,
  fat_per_unit = 0.002,
  fiber_per_unit = 0.016,
  sodium_per_unit = 0.001,
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = 'a03d3a64-3ae8-442f-a2b6-577467fb6e04';

-- MAMÃO FORMOSA (TACO 4: 40 kcal/100g)
UPDATE public.foods 
SET 
  calories_per_unit = 0.40,
  carbohydrates_per_unit = 0.104,
  protein_per_unit = 0.005,
  fat_per_unit = 0.001,
  fiber_per_unit = 0.018,
  sodium_per_unit = 0.003,
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = '78df12ee-f152-4521-b94d-478de12ac274';

-- MAÇÃ (TACO 4: 56 kcal/100g)
UPDATE public.foods 
SET 
  calories_per_unit = 0.56,
  carbohydrates_per_unit = 0.152,
  protein_per_unit = 0.002,
  fat_per_unit = 0.001,
  fiber_per_unit = 0.013,
  sodium_per_unit = 0.0,
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = '8957fc93-eef7-4541-a98f-12a474c003f4';

-- WHEY PROTEIN (valor aproximado baseado no rótulo: 122 kcal/30g)
UPDATE public.foods 
SET 
  calories_per_unit = 4.07, -- 122/30 = 4.07 kcal/g
  carbohydrates_per_unit = 0.19, -- 5.7/30 = 0.19 g/g
  protein_per_unit = 0.67, -- 20/30 = 0.67 g/g
  fat_per_unit = 0.07, -- 2.1/30 = 0.07 g/g
  fiber_per_unit = 0.0,
  sodium_per_unit = 0.0038, -- 114mg/30g = 0.0038 g/g
  default_quantity = 1.0,
  default_unit = 'g'
WHERE id = '79ee1e18-0d91-4f56-a5e7-c3227cd2a589';