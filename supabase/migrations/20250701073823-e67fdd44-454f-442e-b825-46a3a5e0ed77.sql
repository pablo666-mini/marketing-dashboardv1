
-- Create social_profile_metrics table to store API metrics data
CREATE TABLE public.social_profile_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.social_profiles(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL,
  followers_count INTEGER,
  engagement_rate NUMERIC(5,2),
  impressions INTEGER,
  reach INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scheduled_posts table to manage post scheduling
CREATE TABLE public.scheduled_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.social_profiles(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  external_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for better query performance (using B-tree instead of GIN for UUID/timestamp)
CREATE INDEX idx_social_profile_metrics_profile_id 
ON public.social_profile_metrics (profile_id);

CREATE INDEX idx_social_profile_metrics_timestamp 
ON public.social_profile_metrics (timestamp);

CREATE INDEX idx_social_profile_metrics_profile_timestamp 
ON public.social_profile_metrics (profile_id, timestamp);

CREATE INDEX idx_scheduled_posts_profile_id 
ON public.scheduled_posts (profile_id);

CREATE INDEX idx_scheduled_posts_status_scheduled 
ON public.scheduled_posts (status, scheduled_for);

-- Add GIN index on JSONB content column
CREATE INDEX idx_scheduled_posts_content 
ON public.scheduled_posts USING GIN (content);

-- Add comments for documentation
COMMENT ON TABLE public.social_profile_metrics IS 'Stores historical metrics data fetched from social media platform APIs';
COMMENT ON TABLE public.scheduled_posts IS 'Manages scheduled posts for social media platforms';

-- Enable RLS on new tables
ALTER TABLE public.social_profile_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_profile_metrics
-- Allow service role (edge functions) to insert/update metrics
CREATE POLICY "Service role can manage metrics" 
ON public.social_profile_metrics 
FOR ALL 
TO service_role 
USING (true);

-- Allow authenticated users to view metrics
CREATE POLICY "Users can view metrics" 
ON public.social_profile_metrics 
FOR SELECT 
TO authenticated 
USING (true);

-- RLS Policies for scheduled_posts
-- Allow service role (edge functions) to manage scheduled posts
CREATE POLICY "Service role can manage scheduled posts" 
ON public.scheduled_posts 
FOR ALL 
TO service_role 
USING (true);

-- Allow authenticated users to view and manage their scheduled posts
CREATE POLICY "Users can view scheduled posts" 
ON public.scheduled_posts 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create scheduled posts" 
ON public.scheduled_posts 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update scheduled posts" 
ON public.scheduled_posts 
FOR UPDATE 
TO authenticated 
USING (true);
