-- Atualizar todas as meal_foods para usar a unidade correta do alimento
UPDATE meal_foods 
SET unit = foods.default_unit
FROM foods 
WHERE foods.id = meal_foods.food_id 
AND meal_foods.unit != foods.default_unit;

-- Criar função para garantir que meal_foods sempre use a unidade correta
CREATE OR REPLACE FUNCTION ensure_correct_unit()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar a unidade para corresponder ao alimento
    SELECT default_unit INTO NEW.unit 
    FROM foods 
    WHERE id = NEW.food_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para INSERT
CREATE TRIGGER meal_foods_ensure_unit_insert
    BEFORE INSERT ON meal_foods
    FOR EACH ROW
    EXECUTE FUNCTION ensure_correct_unit();

-- Criar trigger para UPDATE quando food_id muda
CREATE TRIGGER meal_foods_ensure_unit_update
    BEFORE UPDATE OF food_id ON meal_foods
    FOR EACH ROW
    WHEN (OLD.food_id IS DISTINCT FROM NEW.food_id)
    EXECUTE FUNCTION ensure_correct_unit();