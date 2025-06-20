
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { LaunchWithPosts, LaunchStatus } from '@/types';

// Transform snake_case to camelCase and create status object
const transformLaunchData = (data: any[]): LaunchWithPosts[] => {
  return data.map(launch => {
    // Map status enum to status object with color
    const getStatusColor = (status: LaunchStatus): string => {
      switch (status) {
        case 'Planned': return '#3b82f6'; // blue
        case 'In Progress': return '#f59e0b'; // yellow
        case 'Completed': return '#10b981'; // green
        case 'Canceled': return '#ef4444'; // red
        default: return '#6b7280'; // gray
      }
    };

    const statusObj = {
      id: launch.status,
      name: launch.status,
      color: getStatusColor(launch.status)
    };

    return {
      id: launch.id,
      name: launch.name,
      startDate: launch.start_date,
      endDate: launch.end_date,
      status: statusObj,
      posts: (launch.social_posts || []).map((post: any) => ({
        id: post.id,
        postDate: post.post_date,
        profileIds: post.profile_ids || []
      }))
    };
  });
};

export const useLaunchesWithPosts = () => {
  return useQuery({
    queryKey: ['launchesWithPosts'],
    queryFn: async (): Promise<LaunchWithPosts[]> => {
      console.log('Fetching launches with posts...');
      
      const { data, error } = await supabase
        .from('launches')
        .select(`
          id,
          name,
          start_date,
          end_date,
          status,
          social_posts (
            id,
            post_date,
            profile_ids
          )
        `)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching launches with posts:', error);
        throw new Error(error.message);
      }

      return transformLaunchData(data || []);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
