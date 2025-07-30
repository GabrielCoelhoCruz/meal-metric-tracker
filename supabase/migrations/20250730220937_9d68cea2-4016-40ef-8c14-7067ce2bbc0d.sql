-- Dropar os triggers primeiro
DROP TRIGGER IF EXISTS meal_foods_ensure_unit_insert ON meal_foods;
DROP TRIGGER IF EXISTS meal_foods_ensure_unit_update ON meal_foods;

-- Agora podemos dropar a função
DROP FUNCTION IF EXISTS ensure_correct_unit();

-- Criar a nova função atualizada
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
CREATE TRIGGER meal_foods_ensure_unit_insert
    BEFORE INSERT ON meal_foods
    FOR EACH ROW
    EXECUTE FUNCTION ensure_correct_unit();

CREATE TRIGGER meal_foods_ensure_unit_update
    BEFORE UPDATE ON meal_foods
    FOR EACH ROW
    WHEN (OLD.food_id IS DISTINCT FROM NEW.food_id OR OLD.substituted_food_id IS DISTINCT FROM NEW.substituted_food_id)
    EXECUTE FUNCTION ensure_correct_unit();