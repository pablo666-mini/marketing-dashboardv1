
// React Query hooks for API calls
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import * as api from '@/api';
import { SocialProfile, SocialPost, CreatePostForm, UpdatePostForm } from '@/types';

// Query keys
export const queryKeys = {
  profiles: ['profiles'],
  posts: ['posts'],
  products: ['products'],
  generalInfo: ['generalInfo'],
  activeProfiles: ['profiles', 'active'],
  postsByDate: (startDate: string, endDate: string) => ['posts', 'dateRange', startDate, endDate]
};

// Profiles hooks
export const useProfiles = () => {
  return useQuery({
    queryKey: queryKeys.profiles,
    queryFn: async () => {
      const response = await api.getProfiles();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useActiveProfiles = () => {
  return useQuery({
    queryKey: queryKeys.activeProfiles,
    queryFn: async () => {
      const response = await api.getActiveProfiles();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SocialProfile> }) => {
      const response = await api.updateProfile(id, updates);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (updatedProfile) => {
      // Update profiles cache
      queryClient.setQueryData(queryKeys.profiles, (old: SocialProfile[] | undefined) => {
        if (!old) return [updatedProfile];
        return old.map(profile => 
          profile.id === updatedProfile.id ? updatedProfile : profile
        );
      });

      // Update active profiles cache if needed
      queryClient.invalidateQueries({ queryKey: queryKeys.activeProfiles });

      toast({
        title: "Perfil actualizado",
        description: `El perfil ha sido ${updatedProfile.active ? 'activado' : 'desactivado'} exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      });
    }
  });
};

// Posts hooks
export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: async () => {
      const response = await api.getPosts();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePostForm) => {
      const response = await api.createPost(postData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (newPost) => {
      // Update posts cache
      queryClient.setQueryData(queryKeys.posts, (old: SocialPost[] | undefined) => {
        if (!old) return [newPost];
        return [...old, newPost];
      });

      toast({
        title: "Publicación creada",
        description: "La publicación ha sido creada exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la publicación",
        variant: "destructive",
      });
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdatePostForm }) => {
      const response = await api.updatePost(id, updates);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (updatedPost) => {
      // Update posts cache
      queryClient.setQueryData(queryKeys.posts, (old: SocialPost[] | undefined) => {
        if (!old) return [updatedPost];
        return old.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });

      toast({
        title: "Publicación actualizada",
        description: "La publicación ha sido actualizada exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la publicación",
        variant: "destructive",
      });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.deletePost(id);
      if (!response.success) {
        throw new Error(response.message);
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Update posts cache
      queryClient.setQueryData(queryKeys.posts, (old: SocialPost[] | undefined) => {
        if (!old) return [];
        return old.filter(post => post.id !== deletedId);
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
    }
  });
};

// Products hooks
export const useProducts = () => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const response = await api.getProducts();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

// General Info hooks
export const useGeneralInfo = () => {
  return useQuery({
    queryKey: queryKeys.generalInfo,
    queryFn: async () => {
      const response = await api.getGeneralInfo();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 15 * 60 * 1000 // 15 minutes
  });
};

// Posts by date range hook
export const usePostsByDateRange = (startDate: string, endDate: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.postsByDate(startDate, endDate),
    queryFn: async () => {
      const response = await api.getPostsByDateRange(startDate, endDate);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled,
    staleTime: 2 * 60 * 1000
  });
};
