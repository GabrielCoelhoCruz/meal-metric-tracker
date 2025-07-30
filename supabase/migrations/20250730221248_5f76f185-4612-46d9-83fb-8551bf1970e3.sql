-- Corrigir manualmente o item com quantidade absurda
-- Pão francês (1 unidade = 300 kcal) → Goma de tapioca (83 kcal por 20g)
-- Cálculo correto: (300 / 83) * 20 = 72.29g
UPDATE meal_foods 
SET quantity = 72.29
WHERE id = '073a18c6-1e02-4940-a53f-d3299448e396' 
AND quantity = 1445.78;