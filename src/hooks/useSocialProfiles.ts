
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { SocialProfile, CreateSocialProfile, UpdateSocialProfile } from '@/types/supabase';

// Query keys
const QUERY_KEY = ['social-profiles'];

export const useSocialProfiles = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<SocialProfile[]> => {
      console.log('Fetching social profiles...');
      const { data, error } = await supabase
        .from('social_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching social profiles:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActiveSocialProfiles = () => {
  return useQuery({
    queryKey: [...QUERY_KEY, 'active'],
    queryFn: async (): Promise<SocialProfile[]> => {
      console.log('Fetching active social profiles...');
      const { data, error } = await supabase
        .from('social_profiles')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active social profiles:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSocialProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CreateSocialProfile): Promise<SocialProfile> => {
      console.log('Creating social profile:', profile);
      const { data, error } = await supabase
        .from('social_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) {
        console.error('Error creating social profile:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (newProfile) => {
      queryClient.setQueryData(QUERY_KEY, (old: SocialProfile[] | undefined) => {
        if (!old) return [newProfile];
        return [newProfile, ...old];
      });

      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'active'] });

      toast({
        title: "Perfil creado",
        description: `El perfil ${newProfile.name} ha sido creado exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el perfil",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSocialProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateSocialProfile }): Promise<SocialProfile> => {
      console.log('Updating social profile:', id, updates);
      const { data, error } = await supabase
        .from('social_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating social profile:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(QUERY_KEY, (old: SocialProfile[] | undefined) => {
        if (!old) return [updatedProfile];
        return old.map(profile => 
          profile.id === updatedProfile.id ? updatedProfile : profile
        );
      });

      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'active'] });

      toast({
        title: "Perfil actualizado",
        description: `El perfil ${updatedProfile.name} ha sido actualizado exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSocialProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting social profile:', id);
      const { error } = await supabase
        .from('social_profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting social profile:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(QUERY_KEY, (old: SocialProfile[] | undefined) => {
        if (!old) return [];
        return old.filter(profile => profile.id !== deletedId);
      });

      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'active'] });

      toast({
        title: "Perfil eliminado",
        description: "El perfil ha sido eliminado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el perfil",
        variant: "destructive",
      });
    },
  });
};
