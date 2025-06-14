import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { SocialPost, PlatformCopy } from '@/types';
import type { CreateSocialPost, UpdateSocialPost } from '@/types/supabase';

const QUERY_KEY = ['social-posts'];

// Helper function to parse copies from database JSON to PlatformCopy[]
const parseCopies = (copies: any): PlatformCopy[] | null => {
  if (!copies) return null;
  if (Array.isArray(copies)) return copies as PlatformCopy[];
  if (typeof copies === 'string') {
    try {
      return JSON.parse(copies) as PlatformCopy[];
    } catch {
      return null;
    }
  }
  return null;
};

// Helper function to transform database post to typed SocialPost with multi-profile support
const transformPost = (post: any): SocialPost => ({
  ...post,
  copies: parseCopies(post.copies),
  profile_ids: post.profile_ids || (post.profile_id ? [post.profile_id] : []) // Handle legacy single profile
});

export const useSocialPosts = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<SocialPost[]> => {
      console.log('Fetching social posts with multi-profile support...');
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('post_date', { ascending: true });

      if (error) {
        console.error('Error fetching social posts:', error);
        throw new Error(error.message);
      }

      return (data || []).map(transformPost);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSocialPostsByDateRange = (startDate: string, endDate: string, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEY, 'date-range', startDate, endDate],
    queryFn: async (): Promise<SocialPost[]> => {
      console.log(`Fetching multi-profile social posts from ${startDate} to ${endDate}...`);
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .gte('post_date', startDate)
        .lte('post_date', endDate)
        .order('post_date', { ascending: true });

      if (error) {
        console.error('Error fetching social posts by date range:', error);
        throw new Error(error.message);
      }

      return (data || []).map(transformPost);
    },
    enabled,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSocialPostsByLaunch = (launchId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEY, 'launch', launchId],
    queryFn: async (): Promise<SocialPost[]> => {
      console.log(`Fetching multi-profile social posts for launch: ${launchId}`);
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('launch_id', launchId)
        .order('post_date', { ascending: true });

      if (error) {
        console.error('Error fetching social posts by launch:', error);
        throw new Error(error.message);
      }

      return (data || []).map(transformPost);
    },
    enabled: !!launchId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateSocialPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: CreateSocialPost & { profile_ids?: string[] }): Promise<SocialPost> => {
      console.log('Creating multi-profile social post:', post);
      
      // Prepare data for database insertion
      const postData = {
        ...post,
        profile_ids: post.profile_ids || (post.profile_id ? [post.profile_id] : [])
      };

      const { data, error } = await supabase
        .from('social_posts')
        .insert(postData)
        .select()
        .single();

      if (error) {
        console.error('Error creating multi-profile social post:', error);
        throw new Error(error.message);
      }

      return transformPost(data);
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData(QUERY_KEY, (old: SocialPost[] | undefined) => {
        if (!old) return [newPost];
        return [...old, newPost].sort((a, b) => 
          new Date(a.post_date).getTime() - new Date(b.post_date).getTime()
        );
      });

      // Invalidate launch-specific queries if post has launch_id
      if (newPost.launch_id) {
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEY, 'launch', newPost.launch_id] 
        });
      }

      const profileCount = newPost.profile_ids.length;
      toast({
        title: "Publicación multi-perfil creada",
        description: `La publicación ha sido creada para ${profileCount} perfil${profileCount > 1 ? 'es' : ''}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la publicación multi-perfil",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSocialPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: UpdateSocialPost & { profile_ids?: string[] }
    }): Promise<SocialPost> => {
      console.log('Updating multi-profile social post:', id, updates);
      
      // Prepare updates with multi-profile support
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('social_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating multi-profile social post:', error);
        throw new Error(error.message);
      }

      return transformPost(data);
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(QUERY_KEY, (old: SocialPost[] | undefined) => {
        if (!old) return [updatedPost];
        return old.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });

      // Invalidate launch-specific queries if post has launch_id
      if (updatedPost.launch_id) {
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEY, 'launch', updatedPost.launch_id] 
        });
      }

      const profileCount = updatedPost.profile_ids.length;
      toast({
        title: "Publicación multi-perfil actualizada",
        description: `La publicación ha sido actualizada para ${profileCount} perfil${profileCount > 1 ? 'es' : ''}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la publicación multi-perfil",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSocialPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting social post:', id);
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting social post:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(QUERY_KEY, (old: SocialPost[] | undefined) => {
        if (!old) return [];
        return old.filter(post => post.id !== deletedId);
      });

      // Invalidate all launch-specific queries since we don't know which launch this post belonged to
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEY, 'launch'] 
      });

      toast({
        title: "Publicación eliminada",
        description: "La publicación ha sido eliminada exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la publicación",
        variant: "destructive",
      });
    },
  });
};
