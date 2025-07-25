// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { OperateurApi } from '../../Api/operateurApi';


export const useDeleteOperateur = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeOperature) =>OperateurApi.deleteOperateur(codeOperature),
    onSuccess: (_, codeOperature) => {
      toast.success(` Operateur  ${codeOperature} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['operateurs'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete Operateur. Please try again.'
      );
    }
  });
};