-- Atualizar todas as meal_foods existentes para usar a unidade correta
UPDATE meal_foods 
SET unit = CASE 
    WHEN substituted_food_id IS NOT NULL THEN 
        (SELECT default_unit FROM foods WHERE id = meal_foods.substituted_food_id)
    ELSE 
        (SELECT default_unit FROM foods WHERE id = meal_foods.food_id)
END;