-- Corrigir os dados dos alimentos para ter as unidades e calorias corretas
UPDATE public.foods 
SET default_quantity = 100, 
    default_unit = 'g',
    calories_per_unit = 0.89, -- 89 kcal per 100g = 0.89 kcal per g
    carbohydrates_per_unit = 0.23, -- 23g per 100g = 0.23g per g
    protein_per_unit = 0.012, -- 1.2g per 100g = 0.012g per g  
    fat_per_unit = 0.002 -- 0.2g per 100g = 0.002g per g
WHERE name = 'Banana';

-- Corrigir o pão francês também
UPDATE public.foods 
SET default_quantity = 50, -- 1 pão francês = 50g
    default_unit = 'g',
    calories_per_unit = 3.0, -- 150 kcal per 50g = 3.0 kcal per g
    carbohydrates_per_unit = 0.58, -- 29g per 50g = 0.58g per g
    protein_per_unit = 0.15, -- 7.5g per 50g = 0.15g per g
    fat_per_unit = 0.06 -- 3g per 50g = 0.06g per g
WHERE name = 'Pão francês';

-- Corrigir ovos para valores por grama
UPDATE public.foods 
SET default_quantity = 50, -- 1 ovo médio = 50g
    default_unit = 'g',
    calories_per_unit = 1.47, -- 73.5 kcal per 50g = 1.47 kcal per g
    carbohydrates_per_unit = 0.006, -- 0.3g per 50g = 0.006g per g
    protein_per_unit = 0.126, -- 6.3g per 50g = 0.126g per g
    fat_per_unit = 0.1 -- 5g per 50g = 0.1g per g
WHERE name = 'Ovo de galinha inteiro';