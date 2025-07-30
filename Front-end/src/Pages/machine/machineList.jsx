import { DataTable } from "../../components/tubeList/data-table";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Machinecolumns } from "./machineColumns";
import { MachineApi } from "../../Api/machineApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { configurationQuery } from "../../configurationQueryClient/configuration";
import { AxiosError } from 'axios';

export default function MachineList() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { 
    data: machineData, 
    isLoading, 
    isError, 
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['machines'],
    queryFn: MachineApi.getAll,
    onError: (err) => {
      toast.error("Échec du chargement des machines", {
        description: err.response?.data?.message || err.message,
        action: {
          label: "Réessayer",
          onClick: () => refetch(),
        },
      });
    },
    select: (data) => data.data.data || [],
    ...configurationQuery
  });

  const handleRetry = () => {
    toast.info("Rechargement des machines en cours...");
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Machines</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading || isRefetching ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Chargement...
              </span>
            ) : (
              `${machineData?.length || 0} ${machineData?.length === 1 ? 'machine' : 'machines'} disponibles`
            )}
          </p>
        </div>
        <div className="flex gap-2">
       
          <Button asChild>
            <Link 
              to="/machine/AddMachine" 
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter machine
            </Link>  
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Chargement des machines...</span>
        </div>
      ) : isError ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Échec du chargement</AlertTitle>
            <AlertDescription>
              {(error).response.data.message || 'Erreur inconnue lors du chargement des machines'}
            </AlertDescription>
               <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRetry}
              disabled={isRefetching}
              className="mt-1"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Rechargement...' : 'Réessayer'}
            </Button>
          
          </div>
          </Alert>
       
        </div>
      ) : (
        <div className="overflow-hidden">
          <DataTable 
            columns={Machinecolumns} 
            data={machineData || []} 
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