import { DataTable } from "../../components/tubeList/data-table";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CausseApi } from "../../Api/causseApi";
import { Caussecolumns } from "./causseColumns";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useState } from "react";
import { configurationQuery } from "../../configurationQueryClient/configuration";
import { AxiosError } from 'axios';

export default function CausseList() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['causses'],
    queryFn: CausseApi.getAll,
    onError: (error) => {
      toast.error("Échec du chargement des causses", {
        description: error.message || "Impossible de charger les causses",
        action: {
          label: "Réessayer",
          onClick: () => refetch(),
        },
        duration: 10000,
      });
    },
    select: (response) => response?.data?.data || [],
    ...configurationQuery
  });

  const handleRetry = () => {
    toast.info("Rechargement des causses en cours...");
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Causses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading || isRefetching ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Chargement...
              </span>
            ) : (
              `${data?.length || 0} ${data?.length === 1 ? 'causse' : 'causses'} enregistrée(s)`
            )}
          </p>
        </div>
        <div className="flex gap-2">
       
          <Button asChild>
            <Link 
              to="/causse/AddCausse" 
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un Causse
            </Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des causses...</span>
        </div>
      ) : isError ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              {(error).response.data?.message || 'Erreur lors du chargement des causses'}
            </AlertDescription>
              <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRetry}
              disabled={isRefetching}
              className="mt-2"
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
            columns={Caussecolumns} 
            data={data} 
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