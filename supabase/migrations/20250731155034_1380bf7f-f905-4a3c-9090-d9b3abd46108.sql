-- Corrigir o item de substituição com quantidade absurda
-- Pão francês (1 unidade = 150 kcal) → Goma de tapioca (83 kcal por 20g)
-- Cálculo correto: (150 / 83) * 20 = 36.14g
UPDATE meal_foods 
SET quantity = 36.14
WHERE id = '073a18c6-1e02-4940-a53f-d3299448e396';