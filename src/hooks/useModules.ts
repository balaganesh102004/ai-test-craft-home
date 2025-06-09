
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesApi, Module } from '@/lib/api';
import { toast } from 'sonner';

export const useModules = (projectId?: number) => {
  return useQuery({
    queryKey: ['modules', projectId],
    queryFn: async () => {
      const response = await modulesApi.getAll(projectId);
      return response.data;
    },
  });
};

export const useModule = (id: number) => {
  return useQuery({
    queryKey: ['modules', id],
    queryFn: async () => {
      const response = await modulesApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) =>
      modulesApi.create(module),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('Module created successfully');
    },
    onError: () => {
      toast.error('Failed to create module');
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...module }: { id: number } & Partial<Module>) =>
      modulesApi.update(id, module),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('Module updated successfully');
    },
    onError: () => {
      toast.error('Failed to update module');
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => modulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('Module deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete module');
    },
  });
};
