
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SablageIntApi } from '../../../Api/SablageIntApi';

export const useDeleteSablage_int = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>SablageIntApi.deleteSablage_int(id), // Accept string directly
    onSuccess: (_, id) => {
      toast.success(`Sablage Interne  ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['sablage_internes'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Sablage Interne. Please try again.'
      );
    }
  });
};