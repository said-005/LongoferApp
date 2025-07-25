
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ConsommaationApi } from './../../Api/consommationApi';

export const useDeleteConsommation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>ConsommaationApi.deleteConsommation(id), // Accept string directly
    onSuccess: (_, id) => {
      toast.success(`Consaommation ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['consommations'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Consaommation. Please try again.'
      );
    }
  });
};