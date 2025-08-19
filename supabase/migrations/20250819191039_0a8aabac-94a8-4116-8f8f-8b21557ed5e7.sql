-- Corrigir as quantidades dos alimentos na refeição específica
UPDATE public.meal_foods 
SET quantity = 200.0 -- 4 unidades x 50g cada = 200g
WHERE meal_id = '4d312885-0b18-4a52-b859-35b232ffa63f' 
AND food_id = '75185daf-c18d-4ca2-aee2-328062960dca'; -- Ovos

UPDATE public.meal_foods 
SET quantity = 100.0 -- 2 unidades x 50g cada = 100g  
WHERE meal_id = '4d312885-0b18-4a52-b859-35b232ffa63f' 
AND food_id = '02936f67-d2f8-488f-b1c7-ba2f7f117456'; -- Pão francês

-- A banana já está correta com 100g