
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Protocol {
  id: string;
  title: string;
  description: string | null;
  type: 'image_naming' | 'briefing' | 'hashtags' | 'general';
  content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProtocolInput {
  title: string;
  description?: string;
  type: 'image_naming' | 'briefing' | 'hashtags' | 'general';
  content: string;
  active?: boolean;
}

export interface UpdateProtocolInput {
  title?: string;
  description?: string;
  type?: 'image_naming' | 'briefing' | 'hashtags' | 'general';
  content?: string;
  active?: boolean;
}

const QUERY_KEY = ['protocols'];

export const useProtocols = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Protocol[]> => {
      console.log('Fetching protocols...');
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching protocols:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};

export const useCreateProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProtocolInput): Promise<Protocol> => {
      console.log('Creating protocol:', input);
      const { data, error } = await supabase
        .from('protocols')
        .insert(input)
        .select()
        .single();

      if (error) {
        console.error('Error creating protocol:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Protocolo creado",
        description: "El protocolo ha sido creado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el protocolo",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateProtocolInput }): Promise<Protocol> => {
      console.log('Updating protocol:', id, updates);
      const { data, error } = await supabase
        .from('protocols')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating protocol:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Protocolo actualizado",
        description: "El protocolo ha sido actualizado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el protocolo",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting protocol:', id);
      const { error } = await supabase
        .from('protocols')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting protocol:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Protocolo eliminado",
        description: "El protocolo ha sido eliminado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el protocolo",
        variant: "destructive",
      });
    },
  });
};
