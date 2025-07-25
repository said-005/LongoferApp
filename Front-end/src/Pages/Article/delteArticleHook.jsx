
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArticleApi } from '../../Api/ArticleApi';

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeArticle) =>ArticleApi.deleteArticle(codeArticle), // Accept string directly
    onSuccess: (_, codeArticle) => {
      toast.success(`Article ${codeArticle} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['Articles'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Article. Please try again.'
      );
    }
  });
};