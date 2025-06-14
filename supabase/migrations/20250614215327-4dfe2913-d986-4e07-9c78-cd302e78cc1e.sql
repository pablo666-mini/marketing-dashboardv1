
-- Eliminar la restricción CHECK de la tabla protocols para permitir tipos personalizados
ALTER TABLE public.protocols DROP CONSTRAINT IF EXISTS protocols_type_check;

-- Eliminar la restricción CHECK de la tabla media_kit_resources para permitir categorías personalizadas
ALTER TABLE public.media_kit_resources DROP CONSTRAINT IF EXISTS media_kit_resources_category_check;
