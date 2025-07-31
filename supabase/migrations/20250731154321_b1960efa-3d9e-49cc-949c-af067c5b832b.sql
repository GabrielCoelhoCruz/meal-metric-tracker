-- Corrigir dados nutricionais baseados na TACO/TBCA (valores por 100g)

-- Ovo de galinha inteiro cru (TBCA - código BRC0012J)
-- Valores corretos: 126 kcal, 2.77g carb, 9.04g prot, 8.74g gord por 100g
-- 1 ovo médio = 50g, então: 63 kcal, 1.39g carb, 4.52g prot, 4.37g gord
UPDATE foods 
SET calories_per_unit = 63, 
    carbohydrates_per_unit = 1.39, 
    protein_per_unit = 4.52, 
    fat_per_unit = 4.37,
    fiber_per_unit = 0,
    sodium_per_unit = 73.5,
    default_quantity = 1,
    default_unit = 'unidade'
WHERE name = 'Ovo de galinha inteiro' OR name LIKE '%Ovo%galinha%inteiro%';

-- Banana (TACO: 89 kcal, 22.8g carb, 1.1g prot, 0.3g gord por 100g)
-- 1 banana média = ~100g
UPDATE foods 
SET calories_per_unit = 89, 
    carbohydrates_per_unit = 22.8, 
    protein_per_unit = 1.1, 
    fat_per_unit = 0.3,
    fiber_per_unit = 2.6,
    sodium_per_unit = 1,
    default_quantity = 1,
    default_unit = 'unidade'
WHERE name = 'Banana' AND default_unit = 'unidade';

-- Pão francês (TACO: ~300 kcal por unidade de 50g)
-- Baseado em valores típicos brasileiros
UPDATE foods 
SET calories_per_unit = 150, 
    carbohydrates_per_unit = 30, 
    protein_per_unit = 6, 
    fat_per_unit = 1.5,
    fiber_per_unit = 1.5,
    sodium_per_unit = 400,
    default_quantity = 1,
    default_unit = 'unidade'
WHERE name = 'Pão francês';