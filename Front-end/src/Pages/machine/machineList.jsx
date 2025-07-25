import { DataTable } from "../../components/tubeList/data-table";
import { Loader2, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Machinecolumns } from "./machineColumns";
import { MachineApi } from "../../Api/machineApi";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function MachineList() {
  const { 
    data: machineData, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['machines'],
    queryFn: MachineApi.getAll,
    onError: (err) => {
      toast.error("Failed to load machines", {
        description: err.response?.data?.message || err.message,
      });
    },
    select: (data) => data.data.data || [], // Normalize data structure
  });

  return (
    <div className="container mx-auto px-4 py-6 mt-25">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Machine Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {machineData?.length || 0} {machineData?.length === 1 ? 'machine' : 'machines'} available
          </p>
        </div>
        <Link 
          to="/machine/AddMachine" 
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          Add machine
        </Link>  
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-gray-500 dark:text-gray-400">Loading machines...</span>
        </div>
      ) : isError ? (
        <div className="bg-destructive/10 border border-destructive text-destructive dark:border-destructive/50 dark:text-destructive p-4 rounded-lg">
          <p>Failed to load machines</p>
          <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-950 rounded-lg border dark:border-gray-800 shadow-sm overflow-hidden">
          <DataTable 
            columns={Machinecolumns} 
            data={machineData} 
            emptyState={
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No machines found</p>
                <Link 
                  to="/machine/AddMachine" 
                  className="inline-flex items-center justify-center gap-2 mt-4 text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add your first machine
                </Link>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}