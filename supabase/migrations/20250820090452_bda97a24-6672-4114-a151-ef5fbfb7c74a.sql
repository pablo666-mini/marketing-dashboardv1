-- Fix function search path security warnings by setting proper search paths

-- Update existing database functions to have secure search paths
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_social_profile_timestamp() CASCADE;

-- Recreate the update_updated_at_column function with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Recreate the update_social_profile_timestamp function with secure search path  
CREATE OR REPLACE FUNCTION public.update_social_profile_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$;

-- Re-create the triggers that were dropped
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_launches_updated_at
    BEFORE UPDATE ON public.launches
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_launch_phases_updated_at
    BEFORE UPDATE ON public.launch_phases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at
    BEFORE UPDATE ON public.social_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at
    BEFORE UPDATE ON public.protocols
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_general_info_updated_at
    BEFORE UPDATE ON public.general_info
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_resources_updated_at
    BEFORE UPDATE ON public.media_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_kit_resources_updated_at
    BEFORE UPDATE ON public.media_kit_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_profiles_updated_at
    BEFORE UPDATE ON public.social_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_profiles_timestamp
    BEFORE UPDATE ON public.social_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_social_profile_timestamp();