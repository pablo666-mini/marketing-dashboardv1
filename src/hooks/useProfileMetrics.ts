
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

      const { data, error } = await supabase
        .from('social_profile_metrics')
        .select('*')
        .eq('profile_id', profileId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching profile metrics:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch the latest metrics for all active profiles
 */
export const useAllProfilesLatestMetrics = () => {
  return useQuery({
    queryKey: ['all-profiles-latest-metrics'],
    queryFn: async () => {
      console.log('Fetching latest metrics for all profiles');

      // First get all active profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('social_profiles')
        .select('id, name, platform, followers_count, engagement_rate')
        .eq('active', true)
        .order('name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw new Error(profilesError.message);
      }

      // Get latest metrics for each profile
      const profilesWithMetrics = await Promise.all(
        (profiles || []).map(async (profile) => {
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

          const currentFollowers = latestMetric?.followers_count || profile.followers_count || 0;
          const previousFollowers = weekAgoMetric?.followers_count || currentFollowers;
          const followersChange = currentFollowers - previousFollowers;

          const currentEngagement = latestMetric?.engagement_rate || profile.engagement_rate || 0;
          const previousEngagement = weekAgoMetric?.engagement_rate || currentEngagement;
          const engagementChange = currentEngagement - previousEngagement;

          return {
            profileId: profile.id,
            profileName: profile.name,
            platform: profile.platform,
            currentFollowers,
            followersChange,
            engagementRate: currentEngagement,
            engagementChange,
            lastUpdated: latestMetric?.timestamp || null
          };
        })
      );

      return profilesWithMetrics;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
