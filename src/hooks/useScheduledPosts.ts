
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
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to schedule a new post
 */
export const useSchedulePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreateScheduledPost & { scheduledFor: string }) => {
      console.log('Scheduling post:', postData);

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
