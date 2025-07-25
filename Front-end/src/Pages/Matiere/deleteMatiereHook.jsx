
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MatiereApi } from '../../Api/matiereApi';

export const useDeleteMatiere = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code_matiere) =>MatiereApi.deleteMatiere(code_matiere), // Accept string directly
    onSuccess: (_, code_matiere) => {
      toast.success(` Matier ${code_matiere} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['matieres'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Matiere. Please try again.'
      );
    }
  });
};