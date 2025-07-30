-- Corrigir função para ter search_path seguro
CREATE OR REPLACE FUNCTION ensure_correct_unit()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
    -- Atualizar a unidade para corresponder ao alimento
    SELECT default_unit INTO NEW.unit 
    FROM foods 
    WHERE id = NEW.food_id;
    
    RETURN NEW;
END;
$$;