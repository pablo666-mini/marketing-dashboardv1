
-- Migration: Limpiar todos los datos de la herramienta
-- Esta migración eliminará todos los registros de todas las tablas
-- manteniendo la estructura intacta

-- Limpiar tabla de publicaciones sociales
DELETE FROM public.social_posts;

-- Limpiar tabla de fases de lanzamiento
DELETE FROM public.launch_phases;

-- Limpiar tabla de lanzamientos
DELETE FROM public.launches;

-- Limpiar tabla de perfiles sociales
DELETE FROM public.social_profiles;

-- Limpiar tabla de productos
DELETE FROM public.products;

-- Limpiar tabla de recursos multimedia
DELETE FROM public.media_resources;

-- Limpiar tabla de recursos del kit de medios
DELETE FROM public.media_kit_resources;

-- Limpiar tabla de protocolos
DELETE FROM public.protocols;

-- Limpiar tabla de información general
DELETE FROM public.general_info;

-- Resetear secuencias si las hubiera (esto asegura que los IDs empiecen desde 1 nuevamente)
-- Nota: Como usamos UUIDs, esto no es necesario, pero se incluye por completitud

-- Confirmar que todas las tablas están vacías
-- (Estas líneas son solo comentarios informativos)
-- SELECT COUNT(*) FROM public.social_posts; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.launch_phases; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.launches; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.social_profiles; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.products; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.media_resources; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.media_kit_resources; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.protocols; -- Debería retornar 0
-- SELECT COUNT(*) FROM public.general_info; -- Debería retornar 0
