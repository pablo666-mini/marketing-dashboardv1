
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LaunchPhase, CreateLaunchPhaseInput, UpdateLaunchPhaseInput } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const launchPhaseQueryKeys = {
  all: ['launch-phases'] as const,
  lists: () => [...launchPhaseQueryKeys.all, 'list'] as const,
  list: (launchId: string) => [...launchPhaseQueryKeys.lists(), launchId] as const,
  details: () => [...launchPhaseQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...launchPhaseQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch launch phases for a specific launch
 */
export const useLaunchPhases = (launchId: string) => {
  return useQuery({
    queryKey: launchPhaseQueryKeys.list(launchId),
    queryFn: async (): Promise<LaunchPhase[]> => {
      console.log('Fetching launch phases for launch:', launchId);
      
      const { data, error } = await supabase
        .from('launch_phases')
        .select('*')
        .eq('launch_id', launchId)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching launch phases:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!launchId,
  });
};

/**
 * Hook to fetch a single launch phase by ID
 */
export const useLaunchPhase = (id: string) => {
  return useQuery({
    queryKey: launchPhaseQueryKeys.detail(id),
    queryFn: async (): Promise<LaunchPhase | null> => {
      console.log('Fetching launch phase:', id);
      
      const { data, error } = await supabase
        .from('launch_phases')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching launch phase:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new launch phase
 */
export const useCreateLaunchPhase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateLaunchPhaseInput): Promise<LaunchPhase> => {
      console.log('Creating launch phase:', input);
      
      const { data, error } = await supabase
        .from('launch_phases')
        .insert({
          ...input,
          status: input.status || 'Not Started',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating launch phase:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: launchPhaseQueryKeys.list(data.launch_id) });
      toast({
        title: 'Fase creada',
        description: `La fase "${data.name}" se ha creado exitosamente.`,
      });
    },
    onError: (error) => {
      console.error('Error creating launch phase:', error);
      toast({
        title: 'Error al crear fase',
        description: 'Hubo un problema al crear la fase. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update an existing launch phase
 */
export const useUpdateLaunchPhase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateLaunchPhaseInput }): Promise<LaunchPhase> => {
      console.log('Updating launch phase:', id, updates);
      
      const { data, error } = await supabase
        .from('launch_phases')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating launch phase:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: launchPhaseQueryKeys.list(data.launch_id) });
      queryClient.invalidateQueries({ queryKey: launchPhaseQueryKeys.detail(data.id) });
      toast({
        title: 'Fase actualizada',
        description: `La fase "${data.name}" se ha actualizado exitosamente.`,
      });
    },
    onError: (error) => {
      console.error('Error updating launch phase:', error);
      toast({
        title: 'Error al actualizar fase',
        description: 'Hubo un problema al actualizar la fase. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a launch phase
 */
export const useDeleteLaunchPhase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      console.log('Deleting launch phase:', id);
      
      // First get the launch_id for cache invalidation
      const { data: phase } = await supabase
        .from('launch_phases')
        .select('launch_id')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('launch_phases')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting launch phase:', error);
        throw error;
      }

      return phase?.launch_id || '';
    },
    onSuccess: (launchId) => {
      queryClient.invalidateQueries({ queryKey: launchPhaseQueryKeys.list(launchId) });
      toast({
        title: 'Fase eliminada',
        description: 'La fase se ha eliminado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error deleting launch phase:', error);
      toast({
        title: 'Error al eliminar fase',
        description: 'Hubo un problema al eliminar la fase. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });
};
