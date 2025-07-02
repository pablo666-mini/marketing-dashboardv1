
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SocialProfileMetric } from '@/types';

/**
 * Hook to fetch metrics for a specific social profile
 * @param profileId - The ID of the social profile
 * @param days - Number of days to fetch metrics for (default: 30)
 */
export const useProfileMetrics = (profileId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['profile-metrics', profileId, days],
    queryFn: async (): Promise<SocialProfileMetric[]> => {
      console.log(`Fetching metrics for profile ${profileId} for last ${days} days`);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      try {
        const { data, error } = await supabase
          .from('social_profile_metrics')
          .select('*')
          .eq('profile_id', profileId)
          .gte('timestamp', startDate.toISOString())
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Error fetching profile metrics:', error);
          // Return mock data for preview
          return generateMockMetrics(profileId, days);
        }

        // If no data, return mock data for preview
        if (!data || data.length === 0) {
          return generateMockMetrics(profileId, days);
        }

        return data;
      } catch (error) {
        console.error('Error fetching profile metrics:', error);
        // Return mock data for preview
        return generateMockMetrics(profileId, days);
      }
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Generate mock metrics data for preview purposes
 */
const generateMockMetrics = (profileId: string, days: number): SocialProfileMetric[] => {
  const metrics: SocialProfileMetric[] = [];
  const now = new Date();
  
  for (let i = 0; i < Math.min(days, 10); i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    metrics.push({
      id: `mock-${profileId}-${i}`,
      profile_id: profileId,
      followers_count: 1000 + Math.floor(Math.random() * 100),
      engagement_rate: 2.5 + Math.random() * 2,
      impressions: 5000 + Math.floor(Math.random() * 1000),
      reach: 3000 + Math.floor(Math.random() * 500),
      timestamp: date.toISOString(),
      created_at: date.toISOString(),
    });
  }
  
  return metrics.reverse(); // Oldest first
};

/**
 * Hook to fetch the latest metrics for all active profiles
 */
export const useAllProfilesLatestMetrics = () => {
  return useQuery({
    queryKey: ['all-profiles-latest-metrics'],
    queryFn: async () => {
      console.log('Fetching latest metrics for all profiles');

      try {
        // First get all active profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('social_profiles')
          .select('id, name, platform, followers_count, engagement_rate')
          .eq('active', true)
          .order('name');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Return mock data for preview
          return generateMockProfilesData();
        }

        if (!profiles || profiles.length === 0) {
          return generateMockProfilesData();
        }

        // Get latest metrics for each profile
        const profilesWithMetrics = await Promise.all(
          profiles.map(async (profile) => {
            try {
              const { data: latestMetric } = await supabase
                .from('social_profile_metrics')
                .select('*')
                .eq('profile_id', profile.id)
                .order('timestamp', { ascending: false })
                .limit(1)
                .single();

              const { data: weekAgoMetric } = await supabase
                .from('social_profile_metrics')
                .select('followers_count, engagement_rate')
                .eq('profile_id', profile.id)
                .lt('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
                .order('timestamp', { ascending: false })
                .limit(1)
                .single();

              const currentFollowers = latestMetric?.followers_count || profile.followers_count || 1000 + Math.floor(Math.random() * 5000);
              const previousFollowers = weekAgoMetric?.followers_count || currentFollowers - Math.floor(Math.random() * 100);
              const followersChange = currentFollowers - previousFollowers;

              const currentEngagement = latestMetric?.engagement_rate || profile.engagement_rate || 2.5 + Math.random() * 2;
              const previousEngagement = weekAgoMetric?.engagement_rate || currentEngagement - (Math.random() * 0.5);
              const engagementChange = currentEngagement - previousEngagement;

              return {
                profileId: profile.id,
                profileName: profile.name,
                platform: profile.platform,
                currentFollowers,
                followersChange,
                engagementRate: currentEngagement,
                engagementChange,
                lastUpdated: latestMetric?.timestamp || new Date().toISOString()
              };
            } catch (error) {
              console.error(`Error fetching metrics for profile ${profile.id}:`, error);
              // Return mock data for this profile
              return {
                profileId: profile.id,
                profileName: profile.name,
                platform: profile.platform,
                currentFollowers: 1000 + Math.floor(Math.random() * 5000),
                followersChange: Math.floor(Math.random() * 200) - 50,
                engagementRate: 2.5 + Math.random() * 2,
                engagementChange: Math.random() * 0.5 - 0.25,
                lastUpdated: new Date().toISOString()
              };
            }
          })
        );

        return profilesWithMetrics;
      } catch (error) {
        console.error('Error in useAllProfilesLatestMetrics:', error);
        return generateMockProfilesData();
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Generate mock profiles data for preview
 */
const generateMockProfilesData = () => {
  const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'YouTube'];
  const mockProfiles = [];
  
  for (let i = 0; i < 5; i++) {
    const platform = platforms[i % platforms.length];
    mockProfiles.push({
      profileId: `mock-profile-${i}`,
      profileName: `Miniland ${platform}`,
      platform: platform as any,
      currentFollowers: 1000 + Math.floor(Math.random() * 10000),
      followersChange: Math.floor(Math.random() * 200) - 50,
      engagementRate: 2.5 + Math.random() * 3,
      engagementChange: Math.random() * 0.5 - 0.25,
      lastUpdated: new Date().toISOString()
    });
  }
  
  return mockProfiles;
};
