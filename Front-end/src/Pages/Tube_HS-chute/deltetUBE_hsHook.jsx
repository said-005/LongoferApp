// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TubeHSApi } from '../../Api/TubeHSApi';


export const useDeleteTubeHS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code_tube_HS) =>TubeHSApi.deleteTube_HS(code_tube_HS),
    onSuccess: (_, code_tube_HS) => {
      toast.success(`Tube_HS  ${code_tube_HS} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['tube_HSs'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Tube_HS. Please try again.'
      );
    }
  });
};