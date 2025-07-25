
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EmmanchementApi } from '../../../Api/Emmanchement';


export const useDeleteEmmanchement= () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>EmmanchementApi.deleteEmmanchement(id), // Accept string directly
    onSuccess: (_, id) => {
      toast.success(`Emmanchement  ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['reparations'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Emmanchement. Please try again.'
      );
    }
  });
};