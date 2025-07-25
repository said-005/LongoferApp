// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CausseApi } from '../../Api/causseApi';

export const useDeleteCausse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code_causse) =>CausseApi.deleteCausse(code_causse), // Accept string directly
    onSuccess: (_, code_causse) => {
      toast.success(`causse  ${code_causse} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['causses'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Causse. Please try again.'
      );
    }
  });
};