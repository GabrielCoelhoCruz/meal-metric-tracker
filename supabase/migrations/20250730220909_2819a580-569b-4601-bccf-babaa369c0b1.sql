-- Corrigir função para atualizar unidade tanto para alimento original quanto substituto
DROP FUNCTION IF EXISTS ensure_correct_unit();

CREATE OR REPLACE FUNCTION ensure_correct_unit()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
    -- Se há um alimento substituto, usar sua unidade
    IF NEW.substituted_food_id IS NOT NULL THEN
        SELECT default_unit INTO NEW.unit 
        FROM foods 
        WHERE id = NEW.substituted_food_id;
    ELSE
        -- Caso contrário, usar a unidade do alimento original
        SELECT default_unit INTO NEW.unit 
        FROM foods 
        WHERE id = NEW.food_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Recriar os triggers
DROP TRIGGER IF EXISTS meal_foods_ensure_unit_insert ON meal_foods;
DROP TRIGGER IF EXISTS meal_foods_ensure_unit_update ON meal_foods;

CREATE TRIGGER meal_foods_ensure_unit_insert
    BEFORE INSERT ON meal_foods
    FOR EACH ROW
    EXECUTE FUNCTION ensure_correct_unit();

CREATE TRIGGER meal_foods_ensure_unit_update
    BEFORE UPDATE ON meal_foods
    FOR EACH ROW
    WHEN (OLD.food_id IS DISTINCT FROM NEW.food_id OR OLD.substituted_food_id IS DISTINCT FROM NEW.substituted_food_id)
    EXECUTE FUNCTION ensure_correct_unit();

-- Atualizar todas as meal_foods existentes para usar a unidade correta
UPDATE meal_foods 
SET unit = CASE 
    WHEN substituted_food_id IS NOT NULL THEN sf.default_unit
    ELSE f.default_unit
END
FROM foods f
LEFT JOIN foods sf ON sf.id = meal_foods.substituted_food_id
WHERE foods.id = meal_foods.food_id AND f.id = meal_foods.food_id;