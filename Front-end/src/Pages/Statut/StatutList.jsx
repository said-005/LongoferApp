import { useQuery } from '@tanstack/react-query';
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { StatutColumns } from "./statutColumns";
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatutApi } from '../../Api/StatutApi';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useState } from 'react';
import { configurationQuery } from '../../configurationQueryClient/configuration';
import { AxiosError } from 'axios';

export default function StatutsList() {
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
    queryKey: ['statuts'],
    queryFn: StatutApi.getAll,
    onError: (error) => {
      toast.error("Erreur de chargement des statuts", {
        description: error.message || "Impossible de charger les statuts qualité",
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

  const statuts = data || [];
  const handleRetry = () => {
    toast.info("Rechargement des statuts en cours...");
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Statuts Qualité</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading || isRefetching ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Chargement en cours...
              </span>
            ) : (
              `${statuts.length} ${statuts.length === 1 ? 'statut' : 'statuts'} disponibles`
            )}
          </p>
        </div>
        
        <div className="flex gap-2">
         
          <Button asChild>
            <Link 
              to={'/statut/AddStatut'}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter Statut</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des statuts...</span>
        </div>
      ) : isError ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              {(error).response?.data?.message || 'Impossible de charger les statuts qualité'}
            </AlertDescription>
            <AlertTitle>
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
            </AlertTitle>
          </Alert>
        
        </div>
      ) : (
        <div className="overflow-hidden">
          <DataTable 
            columns={StatutColumns} 
            data={statuts} 
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