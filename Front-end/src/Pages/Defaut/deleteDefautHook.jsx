// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DefautApi } from '../../Api/defautApi';

export const useDeleteDefaut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeDefaut) =>DefautApi.deleteDefaut(codeDefaut), // Accept string directly
    onSuccess: (_, codeDefaut) => {
      toast.success(`Defaut ${codeDefaut} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['defauts'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Defaut. Please try again.'
      );
    }
  });
};