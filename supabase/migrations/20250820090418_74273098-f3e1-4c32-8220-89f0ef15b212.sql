-- Drop existing overly permissive policies and create secure ones that require authentication

-- Products table - contains business strategies and confidential data
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can create products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "products_authenticated_access" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Launches table - contains launch strategies and timelines
DROP POLICY IF EXISTS "Allow all operations on launches" ON public.launches;
DROP POLICY IF EXISTS "Authenticated users can view launches" ON public.launches;

CREATE POLICY "launches_authenticated_access" 
ON public.launches 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Launch phases table - contains detailed launch planning
DROP POLICY IF EXISTS "Allow all operations on launch_phases" ON public.launch_phases;
DROP POLICY IF EXISTS "Authenticated users can view launch phases" ON public.launch_phases;

CREATE POLICY "launch_phases_authenticated_access" 
ON public.launch_phases 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Social posts table - contains marketing content and strategies  
DROP POLICY IF EXISTS "Allow all operations on social_posts" ON public.social_posts;
DROP POLICY IF EXISTS "Authenticated users can view social posts" ON public.social_posts;

CREATE POLICY "social_posts_authenticated_access" 
ON public.social_posts 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Protocols table - contains internal business protocols
DROP POLICY IF EXISTS "Allow all operations on protocols" ON public.protocols;
DROP POLICY IF EXISTS "Authenticated users can view protocols" ON public.protocols;

CREATE POLICY "protocols_authenticated_access" 
ON public.protocols 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- General info table - contains business information
DROP POLICY IF EXISTS "Allow all operations on general_info" ON public.general_info;
DROP POLICY IF EXISTS "Authenticated users can view general info" ON public.general_info;

CREATE POLICY "general_info_authenticated_access" 
ON public.general_info 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Media resources table - contains marketing assets
DROP POLICY IF EXISTS "Allow all operations on media_resources" ON public.media_resources;
DROP POLICY IF EXISTS "Authenticated users can view media resources" ON public.media_resources;

CREATE POLICY "media_resources_authenticated_access" 
ON public.media_resources 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Media kit resources table - contains marketing assets
DROP POLICY IF EXISTS "Allow all operations on media_kit_resources" ON public.media_kit_resources;
DROP POLICY IF EXISTS "Authenticated users can view media kit resources" ON public.media_kit_resources;

CREATE POLICY "media_kit_resources_authenticated_access" 
ON public.media_kit_resources 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Social profiles table - keep accessible but restrict to authenticated users
DROP POLICY IF EXISTS "Allow all operations on social_profiles" ON public.social_profiles;
DROP POLICY IF EXISTS "Authenticated users can view social profiles" ON public.social_profiles;

CREATE POLICY "social_profiles_authenticated_access" 
ON public.social_profiles 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);