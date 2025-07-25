// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { OfApi } from '../../Api/ofApi';


export const useDeleteOf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeOf) =>OfApi.deleteOF(codeOf),
    onSuccess: (_, codeOf) => {
      toast.success(` OF  ${codeOf} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['ofs'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete of. Please try again.'
      );
    }
  });
};