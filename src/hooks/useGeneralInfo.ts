
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { GeneralInfo, UpdateGeneralInfo } from '@/types/supabase';

const QUERY_KEY = ['general-info'];

export const useGeneralInfo = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<GeneralInfo | null> => {
      console.log('Fetching general info...');
      const { data, error } = await supabase
        .from('general_info')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching general info:', error);
        throw new Error(error.message);
      }

      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useUpdateGeneralInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateGeneralInfo): Promise<GeneralInfo> => {
      console.log('Updating general info:', updates);
      
      // First, check if there's an existing record
      const { data: existing } = await supabase
        .from('general_info')
        .select('id')
        .limit(1)
        .maybeSingle();

      let result;

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('general_info')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating general info:', error);
          throw new Error(error.message);
        }

        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('general_info')
          .insert({ ...updates, updated_at: new Date().toISOString() })
          .select()
          .single();

        if (error) {
          console.error('Error creating general info:', error);
          throw new Error(error.message);
        }

        result = data;
      }

      return result;
    },
    onSuccess: (updatedInfo) => {
      queryClient.setQueryData(QUERY_KEY, updatedInfo);

      toast({
        title: "Información actualizada",
        description: "La información general ha sido actualizada exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la información general",
        variant: "destructive",
      });
    },
  });
};
