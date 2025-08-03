import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { ConsommationColumns } from "./consommationColumns";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ConsommaationApi } from "../../Api/consommationApi";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { configurationQuery } from "../../configurationQueryClient/configuration";

export default function ConsommationList() {
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
    queryKey: ['consommations'],
    queryFn: ConsommaationApi.getAll,
    onError: (error) => {
      toast.error("Échec du chargement des consommations", {
        description: error.message,
        action: {
          label: "Réessayer",
          onClick: () => refetch(),
        },
      });
    },
    select: (response) => response?.data?.data || [],
    ...configurationQuery
  });

  const handleRetry = () => {
    toast.info("Rechargement des données en cours...");
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center h-64 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Chargement des consommations...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Erreur lors du chargement des données</AlertTitle>
          <AlertDescription>
            {(error).response?.data?.message || "Une erreur est survenue lors du chargement des consommations."}
          </AlertDescription>
          <AlertTitle>
            <Button 
            variant="outline" 
            onClick={handleRetry}
            disabled={isRefetching}
            className="mt-1"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Rechargement...' : 'Réessayer'}
          </Button>
          </AlertTitle>
        </Alert>
        
        <div className="flex gap-2">
          
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Liste des Consommations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} {data.length === 1 ? 'consommation' : 'consommations'} enregistrées
            {isRefetching && (
              <span className="ml-2 inline-flex items-center text-primary">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Mise à jour...
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link 
              to={'/consommation/AddConsommation'}
              className="inline-flex items-center gap-2"
              aria-label="Ajouter une nouvelle consommation"
            >
              <span>+ Nouvelle Consommation</span>
            </Link>  
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <DataTable 
          columns={ConsommationColumns} 
          data={data} 
          sorting={sorting}
          onSortingChange={setSorting}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
      </div>
    </div>
  );
}