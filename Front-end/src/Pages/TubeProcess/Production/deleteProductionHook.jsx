
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ProductionApi } from '../../../Api/ProductionApi';

export const useDeleteProduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cpde_production) =>ProductionApi.deleteProduction(cpde_production), // Accept string directly
    onSuccess: (_, cpde_production) => {
      toast.success(`Production ${cpde_production} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['productions'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Production. Please try again.'
      );
    }
  });
};