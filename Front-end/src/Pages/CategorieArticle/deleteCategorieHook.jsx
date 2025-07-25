
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CategorieApi } from '../../Api/CategorieApi';
export const useDeleteCategorie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeCategorie) =>CategorieApi.deleteCategorie(codeCategorie), // Accept string directly
    onSuccess: (_, codeCategorie) => {
      toast.success(`Categorie ${codeCategorie} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Categorie. Please try again.'
      );
    }
  });
};