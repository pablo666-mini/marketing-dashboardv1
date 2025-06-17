
-- Add new columns to social_profiles table for additional editable information
ALTER TABLE social_profiles 
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS url TEXT,
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS growth_rate DECIMAL(5,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS engagement_rate DECIMAL(5,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comment explaining the new columns
COMMENT ON COLUMN social_profiles.followers_count IS 'Current number of followers for tracking growth';
COMMENT ON COLUMN social_profiles.description IS 'Description or bio of the social profile';
COMMENT ON COLUMN social_profiles.url IS 'Direct URL to the social profile';
COMMENT ON COLUMN social_profiles.last_updated IS 'Last time the profile data was updated';
COMMENT ON COLUMN social_profiles.growth_rate IS 'Monthly growth rate percentage';
COMMENT ON COLUMN social_profiles.engagement_rate IS 'Average engagement rate percentage';
COMMENT ON COLUMN social_profiles.notes IS 'Additional notes about the profile';

-- Create or replace function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_social_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_updated when profile is modified
DROP TRIGGER IF EXISTS trigger_update_social_profile_timestamp ON social_profiles;
CREATE TRIGGER trigger_update_social_profile_timestamp
    BEFORE UPDATE ON social_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_social_profile_timestamp();
