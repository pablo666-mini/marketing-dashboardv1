
-- Create enum types for better data integrity
CREATE TYPE platform_type AS ENUM ('Instagram', 'TikTok', 'LinkedIn', 'X', 'Pinterest', 'YouTube');
CREATE TYPE content_type AS ENUM ('Post', 'Reel', 'Story', 'Video');
CREATE TYPE post_status AS ENUM ('Draft', 'Pending', 'Approved', 'Published', 'Canceled');
CREATE TYPE media_type AS ENUM ('banner', 'photo', 'video');

-- Social profiles table
CREATE TABLE public.social_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform platform_type NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table for better data organization
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  landing_url TEXT,
  hashtags TEXT[],
  briefing TEXT,
  communication_kit_url TEXT,
  countries TEXT[],
  sales_objectives TEXT[],
  creative_concept TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social posts table
CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  post_date TIMESTAMPTZ NOT NULL,
  profile_id UUID REFERENCES public.social_profiles(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  content_format TEXT,
  copies JSONB DEFAULT '{}',
  hashtags TEXT[],
  status post_status DEFAULT 'Draft',
  media_resources_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media resources table
CREATE TABLE public.media_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type media_type NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  format TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- General info table for protocols and resources
CREATE TABLE public.general_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocols JSONB DEFAULT '[]',
  media_kit JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_social_posts_date ON public.social_posts(post_date);
CREATE INDEX idx_social_posts_profile ON public.social_posts(profile_id);
CREATE INDEX idx_social_posts_status ON public.social_posts(status);
CREATE INDEX idx_social_profiles_platform ON public.social_profiles(platform);
CREATE INDEX idx_social_profiles_active ON public.social_profiles(active);

-- Insert sample data
INSERT INTO public.products (name, description, countries, sales_objectives, creative_concept) VALUES
('Miniland Baby Walker', 'Innovative baby walker with safety features', ARRAY['Spain', 'France', 'Italy'], ARRAY['Increase brand awareness', 'Generate leads'], 'Safety and fun combined'),
('Miniland Educational Toys', 'STEM learning toys for children', ARRAY['Spain', 'Germany', 'UK'], ARRAY['Drive sales', 'Educate parents'], 'Learning through play');

INSERT INTO public.social_profiles (name, handle, platform, active) VALUES
('Miniland Spain', '@miniland_spain', 'Instagram', true),
('Miniland Official', '@minilandofficial', 'TikTok', true),
('Miniland Baby', '@miniland-baby', 'LinkedIn', true),
('Miniland Toys', '@minilandtoys', 'X', false),
('Miniland Creative', '@minilandcreative', 'Pinterest', true),
('Miniland Channel', '@minilandchannel', 'YouTube', true);

INSERT INTO public.general_info (protocols, media_kit) VALUES
(
  '[
    {"id": "1", "title": "Naming Convention", "description": "Image and video naming standards", "type": "image_naming", "content": "Use format: PRODUCT_PLATFORM_DATE_VERSION"},
    {"id": "2", "title": "Hashtag Guidelines", "description": "Hashtag usage and limits", "type": "hashtags", "content": "Maximum 10 hashtags per post, use brand-specific tags"}
  ]',
  '[
    {"id": "1", "name": "Brand Guidelines", "category": "press_note", "url": "https://miniland.com/brand-guide.pdf", "description": "Complete brand guidelines"},
    {"id": "2", "name": "Product Photos", "category": "photos", "url": "https://miniland.com/photos/", "description": "High-res product photography"}
  ]'
);

-- Insert sample posts with simpler approach
INSERT INTO public.social_posts (product_id, post_date, profile_id, content_type, content_format, copies, hashtags, status) VALUES
((SELECT id FROM public.products LIMIT 1), NOW() + INTERVAL '1 day', (SELECT id FROM public.social_profiles WHERE platform = 'Instagram' LIMIT 1), 'Post', '1:1', '{"Instagram": "Check out our amazing baby walker! #miniland #babysafety"}', ARRAY['miniland', 'babysafety', 'innovation'], 'Draft'),
((SELECT id FROM public.products LIMIT 1), NOW() + INTERVAL '2 days', (SELECT id FROM public.social_profiles WHERE platform = 'TikTok' LIMIT 1), 'Reel', '9:16', '{"TikTok": "New baby walker reveal! 👶✨ #miniland #baby"}', ARRAY['miniland', 'baby', 'reveal'], 'Approved'),
((SELECT id FROM public.products LIMIT 1), NOW() + INTERVAL '3 days', (SELECT id FROM public.social_profiles WHERE platform = 'LinkedIn' LIMIT 1), 'Post', '4:5', '{"LinkedIn": "Innovation in baby safety - our latest walker design combines fun with protection."}', ARRAY['miniland', 'innovation', 'safety'], 'Published'),
((SELECT id FROM public.products OFFSET 1 LIMIT 1), NOW() + INTERVAL '4 days', (SELECT id FROM public.social_profiles WHERE platform = 'Pinterest' LIMIT 1), 'Post', '1:1', '{"Pinterest": "Educational toys that inspire learning through play 🎓"}', ARRAY['miniland', 'education', 'toys'], 'Pending'),
((SELECT id FROM public.products OFFSET 1 LIMIT 1), NOW() + INTERVAL '5 days', (SELECT id FROM public.social_profiles WHERE platform = 'YouTube' LIMIT 1), 'Video', '16:9', '{"YouTube": "Discover how our STEM toys help children learn while having fun!"}', ARRAY['miniland', 'STEM', 'learning'], 'Draft');
