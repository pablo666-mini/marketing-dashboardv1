
-- Add launch_id column to social_posts table to link posts with launches
ALTER TABLE public.social_posts 
ADD COLUMN launch_id UUID REFERENCES public.launches(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_social_posts_launch_id ON public.social_posts(launch_id);

-- Update existing posts to potentially link them with launches (optional)
-- This is just a placeholder - in real scenarios you might want to do this manually
-- or based on specific business logic
COMMENT ON COLUMN public.social_posts.launch_id IS 'Links social posts to specific product launches';
