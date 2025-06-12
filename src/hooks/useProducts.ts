
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Product, CreateProduct, UpdateProduct } from '@/types/supabase';

const QUERY_KEY = ['products'];

export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Product[]> => {
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: CreateProduct): Promise<Product> => {
      console.log('Creating product:', product);
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData(QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [newProduct];
        return [newProduct, ...old];
      });

      toast({
        title: "Producto creado",
        description: `El producto ${newProduct.name} ha sido creado exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el producto",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateProduct }): Promise<Product> => {
      console.log('Updating product:', id, updates);
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [updatedProduct];
        return old.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
      });

      toast({
        title: "Producto actualizado",
        description: `El producto ${updatedProduct.name} ha sido actualizado exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el producto",
        variant: "destructive",
      });
    },
  });
};
