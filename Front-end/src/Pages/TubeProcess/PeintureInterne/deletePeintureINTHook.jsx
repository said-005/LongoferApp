
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PeintureIntApi } from '../../../Api/peinture_intApi';

export const useDeletePeinture_ext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>PeintureIntApi.deletePeinture_intt(id), // Accept string directly
    onSuccess: (_, id) => {
      toast.success(`Peinture Interne  ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['peinture_internes'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Peinture Interne  . Please try again.'
      );
    }
  });
};