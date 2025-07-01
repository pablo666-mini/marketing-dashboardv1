
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to manually trigger metrics fetching for a specific profile
 */
export const useFetchProfileMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      console.log('Triggering metrics fetch for profile:', profileId);

      const { data, error } = await supabase.functions.invoke('fetch-metrics', {
        body: { profileId }
      });

      if (error) {
        console.error('Error calling fetch-metrics function:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data, profileId) => {
      // Invalidate related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['profile-metrics', profileId] });
      queryClient.invalidateQueries({ queryKey: ['all-profiles-latest-metrics'] });

      toast({
        title: "Métricas actualizadas",
        description: "Las métricas del perfil han sido actualizadas exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar las métricas",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to trigger metrics fetching for all active profiles
 */
export const useFetchAllMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Triggering metrics fetch for all profiles');

      // First get all active profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('social_profiles')
        .select('id')
        .eq('active', true);

      if (profilesError) {
        throw new Error(profilesError.message);
      }

      // Fetch metrics for each profile
      const results = await Promise.allSettled(
        (profiles || []).map(async (profile) => {
          const { data, error } = await supabase.functions.invoke('fetch-metrics', {
            body: { profileId: profile.id }
          });

          if (error) {
            throw new Error(`Profile ${profile.id}: ${error.message}`);
          }

          return data;
        })
      );

      const failures = results.filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.warn('Some metrics fetches failed:', failures);
      }

      return {
        total: profiles?.length || 0,
        successful: results.length - failures.length,
        failed: failures.length
      };
    },
    onSuccess: (data) => {
      // Invalidate all metrics queries
      queryClient.invalidateQueries({ queryKey: ['profile-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['all-profiles-latest-metrics'] });

      toast({
        title: "Métricas actualizadas",
        description: `Se actualizaron ${data.successful} de ${data.total} perfiles exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar las métricas",
        variant: "destructive",
      });
    },
  });
};
