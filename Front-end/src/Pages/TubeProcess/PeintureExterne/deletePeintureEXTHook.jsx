
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PeintureExtApi } from '../../../Api/peinture_extApi';


export const useDeletePeinture_ext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>PeintureExtApi.deletePeinture_ext(id), // Accept string directly
    onSuccess: (_, id) => {
      toast.success(`Peinture Externe  ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['peinture_externes'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Peinture Externe  . Please try again.'
      );
    }
  });
};