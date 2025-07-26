-- Atualizar a senha do usuário para Bia0202@
UPDATE auth.users 
SET encrypted_password = crypt('Bia0202@', gen_salt('bf'))
WHERE email = 'beatrizsantana700@yahoo.com.br';