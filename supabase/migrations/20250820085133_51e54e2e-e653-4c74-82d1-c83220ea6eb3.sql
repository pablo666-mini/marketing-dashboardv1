-- First, let's update RLS policies to require authentication for all sensitive business tables

-- Update products table policies (contains business strategies, briefings, creative concepts)
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;

CREATE POLICY "Authenticated users can view products" 
ON public.products 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- Update launches table policies (contains launch strategies and timelines)
DROP POLICY IF EXISTS "Allow all operations on launches" ON public.launches;

CREATE POLICY "Authenticated users can view launches" 
ON public.launches 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create launches" 
ON public.launches 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update launches" 
ON public.launches 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete launches" 
ON public.launches 
FOR DELETE 
TO authenticated 
USING (true);

-- Update launch_phases table policies (contains detailed launch planning)
DROP POLICY IF EXISTS "Allow all operations on launch_phases" ON public.launch_phases;

CREATE POLICY "Authenticated users can view launch phases" 
ON public.launch_phases 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create launch phases" 
ON public.launch_phases 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update launch phases" 
ON public.launch_phases 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete launch phases" 
ON public.launch_phases 
FOR DELETE 
TO authenticated 
USING (true);

-- Update social_posts table policies (contains marketing content and strategies)
DROP POLICY IF EXISTS "Allow all operations on social_posts" ON public.social_posts;

CREATE POLICY "Authenticated users can view social posts" 
ON public.social_posts 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create social posts" 
ON public.social_posts 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update social posts" 
ON public.social_posts 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete social posts" 
ON public.social_posts 
FOR DELETE 
TO authenticated 
USING (true);

-- Update protocols table policies (contains internal business protocols)
DROP POLICY IF EXISTS "Allow all operations on protocols" ON public.protocols;

CREATE POLICY "Authenticated users can view protocols" 
ON public.protocols 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create protocols" 
ON public.protocols 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update protocols" 
ON public.protocols 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete protocols" 
ON public.protocols 
FOR DELETE 
TO authenticated 
USING (true);

-- Update general_info table policies (contains business information)
DROP POLICY IF EXISTS "Allow all operations on general_info" ON public.general_info;

CREATE POLICY "Authenticated users can view general info" 
ON public.general_info 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create general info" 
ON public.general_info 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update general info" 
ON public.general_info 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete general info" 
ON public.general_info 
FOR DELETE 
TO authenticated 
USING (true);

-- Update media_resources table policies (contains marketing assets)
DROP POLICY IF EXISTS "Allow all operations on media_resources" ON public.media_resources;

CREATE POLICY "Authenticated users can view media resources" 
ON public.media_resources 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create media resources" 
ON public.media_resources 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update media resources" 
ON public.media_resources 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete media resources" 
ON public.media_resources 
FOR DELETE 
TO authenticated 
USING (true);

-- Update media_kit_resources table policies (contains marketing assets)
DROP POLICY IF EXISTS "Allow all operations on media_kit_resources" ON public.media_kit_resources;

CREATE POLICY "Authenticated users can view media kit resources" 
ON public.media_kit_resources 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create media kit resources" 
ON public.media_kit_resources 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update media kit resources" 
ON public.media_kit_resources 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete media kit resources" 
ON public.media_kit_resources 
FOR DELETE 
TO authenticated 
USING (true);

-- Keep social_profiles accessible but restrict to authenticated users
DROP POLICY IF EXISTS "Allow all operations on social_profiles" ON public.social_profiles;

CREATE POLICY "Authenticated users can view social profiles" 
ON public.social_profiles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create social profiles" 
ON public.social_profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update social profiles" 
ON public.social_profiles 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete social profiles" 
ON public.social_profiles 
FOR DELETE 
TO authenticated 
USING (true);