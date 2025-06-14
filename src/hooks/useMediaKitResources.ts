
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MediaKitResource {
  id: string;
  name: string;
  description: string | null;
  category: string; // Changed to accept any string
  url: string;
  format: string | null;
  file_size: number | null;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMediaKitResourceInput {
  name: string;
  description?: string;
  category: string; // Changed to accept any string
  url: string;
  format?: string;
  file_size?: number;
  tags?: string[];
  active?: boolean;
}

export interface UpdateMediaKitResourceInput {
  name?: string;
  description?: string;
  category?: string; // Changed to accept any string
  url?: string;
  format?: string;
  file_size?: number;
  tags?: string[];
  active?: boolean;
}

const QUERY_KEY = ['media-kit-resources'];

export const useMediaKitResources = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<MediaKitResource[]> => {
      console.log('Fetching media kit resources...');
      const { data, error } = await supabase
        .from('media_kit_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching media kit resources:', error);
        throw new Error(error.message);
      }

      return (data || []) as MediaKitResource[];
    },
  });
};

export const useCreateMediaKitResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMediaKitResourceInput): Promise<MediaKitResource> => {
      console.log('Creating media kit resource:', input);
      const { data, error } = await supabase
        .from('media_kit_resources')
        .insert(input)
        .select()
        .single();

      if (error) {
        console.error('Error creating media kit resource:', error);
        throw new Error(error.message);
      }

      return data as MediaKitResource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Recurso creado",
        description: "El recurso del kit de medios ha sido creado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el recurso",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMediaKitResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateMediaKitResourceInput }): Promise<MediaKitResource> => {
      console.log('Updating media kit resource:', id, updates);
      const { data, error } = await supabase
        .from('media_kit_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating media kit resource:', error);
        throw new Error(error.message);
      }

      return data as MediaKitResource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Recurso actualizado",
        description: "El recurso del kit de medios ha sido actualizado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el recurso",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMediaKitResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting media kit resource:', id);
      const { error } = await supabase
        .from('media_kit_resources')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting media kit resource:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Recurso eliminado",
        description: "El recurso del kit de medios ha sido eliminado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el recurso",
        variant: "destructive",
      });
    },
  });
};
