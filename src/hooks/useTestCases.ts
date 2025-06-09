
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testCasesApi, TestCase } from '@/lib/api';
import { toast } from 'sonner';

export const useTestCases = (moduleId?: number) => {
  return useQuery({
    queryKey: ['test-cases', moduleId],
    queryFn: async () => {
      const response = await testCasesApi.getAll(moduleId);
      return response.data;
    },
  });
};

export const useTestCase = (id: number) => {
  return useQuery({
    queryKey: ['test-cases', id],
    queryFn: async () => {
      const response = await testCasesApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateTestCase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (testCase: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>) =>
      testCasesApi.create(testCase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-cases'] });
      toast.success('Test case created successfully');
    },
    onError: () => {
      toast.error('Failed to create test case');
    },
  });
};

export const useGenerateTestCases = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ moduleId, type, data }: { moduleId: number; type: 'images' | 'requirements'; data: any }) =>
      testCasesApi.generate(moduleId, type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-cases'] });
      toast.success('Test cases generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate test cases');
    },
  });
};
