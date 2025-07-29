import { DataTable } from "../../components/tubeList/data-table";
import { Loader2, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Machinecolumns } from "./machineColumns";
import { MachineApi } from "../../Api/machineApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function MachineList() {
   const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
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
    select: (data) => data.data.data || [],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Machine Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {machineData?.length || 0} {machineData?.length === 1 ? 'machine' : 'machines'} available
          </p>
        </div>
        <Button asChild>
          <Link 
            to="/machine/AddMachine" 
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add machine
          </Link>  
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading machines...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load machines</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="overflow-hidden">
          <DataTable 
            columns={Machinecolumns} 
            data={machineData} 
             sorting={sorting}
              onSortingChange={setSorting}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
          />
        </div>
      )}
    </div>
  );
}