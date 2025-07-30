import { DataTable } from "../../components/tubeList/data-table";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DefautApi } from "../../Api/defautApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Defautcolumns } from './defautColumns';
import { configurationQuery } from "../../configurationQueryClient/configuration";

export default function DefautList() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();
  
  const { 
    data: defauts, 
    isLoading, 
    isError, 
    error,
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['defauts'],
    queryFn: DefautApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    ...configurationQuery,
    onError: (err) => {
      // Centralized error handling
      const errorMessage = err.response?.data?.message || "Une erreur inattendue est survenue";
      const statusCode = err.response?.status;
      
      toast.error(`Erreur ${statusCode || ''}`, {
        description: errorMessage,
        action: {
          label: "Réessayer",
          onClick: () => refetch(),
        },
        duration: 10000,
      });

      // Redirect if unauthorized
      if (statusCode === 401) {
        navigate('/login');
      }
    }
  });

  const defautsData = defauts?.data?.data || [];

  const handleRetry = () => {
    toast.info("Rechargement des données...");
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Défauts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading || isRefetching ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Chargement...
              </span>
            ) : (
              `${defautsData.length} ${defautsData.length === 1 ? 'défaut' : 'défauts'} enregistrés`
            )}
          </p>
        </div>
        <div className="flex gap-2">
         
          <Button asChild>
            <Link 
              to={'/defaut/AddDefaut'}
              className="inline-flex items-center gap-2"
            >
              <span>+ Ajouter Défaut</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Chargement des données...
          </p>
        </div>
      ) : isError ? (
        <div className="p-6 text-center">
          <div className="text-destructive mb-4">
            <h3 className="font-medium">Erreur lors du chargement des données</h3>
            <p className="text-sm mt-1">
              {(error).response?.data?.message || 
               "Veuillez réessayer plus tard"}
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
            
          </div>
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg">
          <DataTable 
            columns={Defautcolumns} 
            data={defautsData} 
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