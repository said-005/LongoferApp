
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ReparationApi } from '../../../Api/ReparationApi';

export const useDeleteReparation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code_Reparation) =>ReparationApi.deleteReparation(code_Reparation), // Accept string directly
    onSuccess: (_, code_Reparation) => {
      toast.success(`Reparation  ${code_Reparation} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['reparations'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Reparation. Please try again.'
      );
    }
  });
};