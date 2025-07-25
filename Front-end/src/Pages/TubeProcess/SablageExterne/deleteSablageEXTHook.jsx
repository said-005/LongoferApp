
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SablageEXTApi } from '../../../Api/Sablage_Ext';

export const useDeleteSablage_ext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>SablageEXTApi.deleteSablage_ext(id), // Accept string directly
    onSuccess: (_, id) => {
      toast.success(`Sablage Externe  ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['sablage_externes'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Sablage Externe. Please try again.'
      );
    }
  });
};