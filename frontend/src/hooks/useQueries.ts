import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, type Product, type NewProduct, type UpdateProduct } from '../backend';

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ['products', 'id', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVerifyAdmin() {
  const { actor } = useActor();
  return useMutation<boolean, Error, { password: string }>({
    mutationFn: async ({ password }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.verifyAdminPassword(password);
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: string; productInfo: NewProduct }>({
    mutationFn: async ({ id, productInfo }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addProduct(id, productInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<Product, Error, UpdateProduct>({
    mutationFn: async (productInfo) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateProduct(productInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<Product, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export { Category };
