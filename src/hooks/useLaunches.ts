
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Launch, CreateLaunchInput, UpdateLaunchInput, LaunchFilters } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const launchQueryKeys = {
  all: ['launches'] as const,
  lists: () => [...launchQueryKeys.all, 'list'] as const,
  list: (filters: LaunchFilters) => [...launchQueryKeys.lists(), filters] as const,
  details: () => [...launchQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...launchQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch launches with optional filtering
 */
export const useLaunches = (filters: LaunchFilters = {}) => {
  return useQuery({
    queryKey: launchQueryKeys.list(filters),
    queryFn: async (): Promise<Launch[]> => {
      console.log('Fetching launches with filters:', filters);
      
      let query = supabase
        .from('launches')
        .select('*')
        .order('start_date', { ascending: false });

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }

      if (filters.productId) {
        query = query.eq('product_id', filters.productId);
      }

      if (filters.dateRange) {
        query = query
          .gte('start_date', filters.dateRange.start)
          .lte('end_date', filters.dateRange.end);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching launches:', error);
        throw error;
      }

      return data || [];
    },
  });
};

/**
 * Hook to fetch a single launch by ID
 */
export const useLaunch = (id: string) => {
  return useQuery({
    queryKey: launchQueryKeys.detail(id),
    queryFn: async (): Promise<Launch | null> => {
      console.log('Fetching launch:', id);
      
      const { data, error } = await supabase
        .from('launches')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching launch:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new launch
 */
export const useCreateLaunch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateLaunchInput): Promise<Launch> => {
      console.log('Creating launch:', input);
      
      const { data, error } = await supabase
        .from('launches')
        .insert({
          ...input,
          status: input.status || 'Planned',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating launch:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: launchQueryKeys.all });
      toast({
        title: 'Lanzamiento creado',
        description: `El lanzamiento "${data.name}" se ha creado exitosamente.`,
      });
    },
    onError: (error) => {
      console.error('Error creating launch:', error);
      toast({
        title: 'Error al crear lanzamiento',
        description: 'Hubo un problema al crear el lanzamiento. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update an existing launch
 */
export const useUpdateLaunch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateLaunchInput }): Promise<Launch> => {
      console.log('Updating launch:', id, updates);
      
      const { data, error } = await supabase
        .from('launches')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating launch:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: launchQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: launchQueryKeys.detail(data.id) });
      toast({
        title: 'Lanzamiento actualizado',
        description: `El lanzamiento "${data.name}" se ha actualizado exitosamente.`,
      });
    },
    onError: (error) => {
      console.error('Error updating launch:', error);
      toast({
        title: 'Error al actualizar lanzamiento',
        description: 'Hubo un problema al actualizar el lanzamiento. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a launch
 */
export const useDeleteLaunch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting launch:', id);
      
      const { error } = await supabase
        .from('launches')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting launch:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: launchQueryKeys.all });
      toast({
        title: 'Lanzamiento eliminado',
        description: 'El lanzamiento se ha eliminado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error deleting launch:', error);
      toast({
        title: 'Error al eliminar lanzamiento',
        description: 'Hubo un problema al eliminar el lanzamiento. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });
};
