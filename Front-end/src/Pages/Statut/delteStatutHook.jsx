// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { StatutApi } from '../../Api/StatutApi';

export const useDeleteStatut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeStatut) =>StatutApi.deleteStatut(codeStatut),
    onSuccess: (_, codeClient) => {
      toast.success(`Statut  ${codeClient} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['Statuts'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Statut. Please try again.'
      );
    }
  });
};