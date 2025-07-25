// deleteClientHook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MachineApi } from '../../Api/machineApi';
export const useDeleteMachine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codeMachine) =>MachineApi.deleteMachine(codeMachine), // Accept string directly
    onSuccess: (_, codeMachine) => {
      toast.success(`Machine ${codeMachine} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        'Failed to delete machine. Please try again.'
      );
    }
  });
};