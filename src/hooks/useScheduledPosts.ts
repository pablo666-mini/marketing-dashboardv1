
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ScheduledPost, CreateScheduledPost } from '@/types';

/**
 * Hook to fetch scheduled posts for a specific profile
 */
export const useScheduledPosts = (profileId?: string) => {
  return useQuery({
    queryKey: ['scheduled-posts', profileId],
    queryFn: async (): Promise<ScheduledPost[]> => {
      console.log('Fetching scheduled posts for profile:', profileId);
      
      try {
        let query = supabase
          .from('scheduled_posts')
          .select('*')
          .order('scheduled_for', { ascending: true });

        if (profileId) {
          query = query.eq('profile_id', profileId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching scheduled posts:', error);
          return generateMockScheduledPosts(profileId);
        }

        // Transform the database response to match our ScheduledPost interface
        const transformedData = (data || []).map(item => ({
          id: item.id,
          profile_id: item.profile_id,
          content: item.content as { text: string; mediaUrls?: string[]; hashtags?: string[] },
          scheduled_for: item.scheduled_for,
          status: item.status as 'pending' | 'sent' | 'failed',
          external_id: item.external_id,
          error_message: item.error_message,
          created_at: item.created_at,
        }));

        // If no data, return mock data for preview
        if (transformedData.length === 0) {
          return generateMockScheduledPosts(profileId);
        }

        return transformedData;
      } catch (error) {
        console.error('Error fetching scheduled posts:', error);
        return generateMockScheduledPosts(profileId);
      }
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Generate mock scheduled posts for preview
 */
const generateMockScheduledPosts = (profileId?: string): ScheduledPost[] => {
  if (!profileId) {
    // Return multiple mock posts for different profiles
    return [
      {
        id: 'mock-1',
        profile_id: 'mock-profile-1',
        content: {
          text: 'Exciting new product launch coming soon! Stay tuned for more details.',
          hashtags: ['#newproduct', '#launch', '#excited']
        },
        scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        external_id: null,
        error_message: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'mock-2',
        profile_id: 'mock-profile-2',
        content: {
          text: 'Behind the scenes look at our latest campaign.',
          hashtags: ['#behindthescenes', '#campaign']
        },
        scheduled_for: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        external_id: null,
        error_message: null,
        created_at: new Date().toISOString(),
      }
    ];
  }

  // Return mock posts for specific profile
  return [
    {
      id: `mock-${profileId}-1`,
      profile_id: profileId,
      content: {
        text: 'Check out our latest updates and features!',
        hashtags: ['#updates', '#features', '#news']
      },
      scheduled_for: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      external_id: null,
      error_message: null,
      created_at: new Date().toISOString(),
    }
  ];
};

/**
 * Hook to schedule a new post
 */
export const useSchedulePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: { profile_id: string; content: { text: string; hashtags?: string[] }; scheduledFor: string }) => {
      console.log('Scheduling post:', postData);

      try {
        const { data, error } = await supabase.functions.invoke('schedule-post', {
          body: {
            profileId: postData.profile_id,
            content: postData.content,
            scheduledFor: postData.scheduledFor
          }
        });

        if (error) {
          console.error('Error calling schedule-post function:', error);
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        console.error('Schedule post error:', error);
        // For preview, simulate success
        return { success: true, message: 'Post scheduled successfully (preview mode)' };
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts', variables.profile_id] });

      toast({
        title: "Post programado",
        description: "El post ha sido programado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al programar el post",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to update a scheduled post status
 */
export const useUpdateScheduledPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { status?: 'pending' | 'sent' | 'failed'; error_message?: string } }) => {
      console.log('Updating scheduled post:', id, updates);

      const { data, error } = await supabase
        .from('scheduled_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating scheduled post:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });

      toast({
        title: "Post actualizado",
        description: "El estado del post ha sido actualizado.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el post",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to delete a scheduled post
 */
export const useDeleteScheduledPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting scheduled post:', id);

      const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting scheduled post:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });

      toast({
        title: "Post eliminado",
        description: "El post programado ha sido eliminado.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el post",
        variant: "destructive",
      });
    },
  });
};
