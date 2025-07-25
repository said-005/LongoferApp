// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientApi } from '../../Api/ClientApi';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeClient) =>ClientApi.deleteClient(codeClient), // Accept string directly
    onSuccess: (_, codeClient) => {
      toast.success(`Client ${codeClient} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete client. Please try again.'
      );
    }
  });
};