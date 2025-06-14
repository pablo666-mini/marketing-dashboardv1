
-- Add profile_ids column to social_posts table for multi-profile support
ALTER TABLE public.social_posts 
ADD COLUMN IF NOT EXISTS profile_ids UUID[] DEFAULT '{}' NOT NULL;

-- Create GIN index for efficient array queries on profile_ids
CREATE INDEX IF NOT EXISTS idx_social_posts_profile_ids 
ON public.social_posts USING GIN(profile_ids);

-- Add comment explaining the column purpose
COMMENT ON COLUMN public.social_posts.profile_ids IS 'Array of social_profile IDs for multi-profile posts';

-- Migrate existing data: convert single profile_id to profile_ids array
UPDATE public.social_posts 
SET profile_ids = CASE 
    WHEN profile_id IS NOT NULL THEN ARRAY[profile_id]
    ELSE '{}'
END
WHERE profile_ids = '{}' OR profile_ids IS NULL;
