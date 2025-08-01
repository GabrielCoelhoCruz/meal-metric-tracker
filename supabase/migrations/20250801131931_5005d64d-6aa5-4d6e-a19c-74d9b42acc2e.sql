-- Verificar e corrigir outros alimentos comuns com valores TACO

-- Arroz tipo 1 cozido (TACO: 128 kcal por 100g)
UPDATE foods 
SET calories_per_unit = 128, 
    carbohydrates_per_unit = 26.2, 
    protein_per_unit = 2.5, 
    fat_per_unit = 0.2,
    fiber_per_unit = 1.6,
    sodium_per_unit = 1,
    default_quantity = 100,
    default_unit = 'g'
WHERE name = 'Arroz tipo 1 cozido';

-- Whey Protein - valores típicos por 30g (1 scoop)
UPDATE foods 
SET calories_per_unit = 120, 
    carbohydrates_per_unit = 3, 
    protein_per_unit = 24, 
    fat_per_unit = 1,
    fiber_per_unit = 0,
    sodium_per_unit = 50,
    default_quantity = 30,
    default_unit = 'g'
WHERE name LIKE '%Whey Protein%';

-- Filé de frango grelhado (TACO: 159 kcal por 100g)
UPDATE foods 
SET calories_per_unit = 159, 
    carbohydrates_per_unit = 0, 
    protein_per_unit = 32.8, 
    fat_per_unit = 2.9,
    fiber_per_unit = 0,
    sodium_per_unit = 77,
    default_quantity = 100,
    default_unit = 'g'
WHERE name LIKE '%Filé de frango%' OR name LIKE '%frango grelhado%';

-- Mamão formosa (TACO: 40 kcal por 100g)
UPDATE foods 
SET calories_per_unit = 40, 
    carbohydrates_per_unit = 10.4, 
    protein_per_unit = 0.5, 
    fat_per_unit = 0.1,
    fiber_per_unit = 1.8,
    sodium_per_unit = 3,
    default_quantity = 100,
    default_unit = 'g'
WHERE name = 'Mamão formosa';

-- Maçã (TACO: 56 kcal por unidade média de ~130g)
UPDATE foods 
SET calories_per_unit = 56, 
    carbohydrates_per_unit = 15.2, 
    protein_per_unit = 0.3, 
    fat_per_unit = 0.1,
    fiber_per_unit = 1.3,
    sodium_per_unit = 2,
    default_quantity = 1,
    default_unit = 'unidade'
WHERE name = 'Maçã';