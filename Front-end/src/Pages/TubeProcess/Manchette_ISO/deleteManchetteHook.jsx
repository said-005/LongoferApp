
// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ManchetteApi } from '../../../Api/Manchette';
export const useDeleteManchette = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>ManchetteApi.deleteManchette(id), // Accept string directly
    onSuccess: (_, id) => {
      toast.success(`Manchette  ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['manchettes'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Manchette. Please try again.'
      );
    }
  });
};