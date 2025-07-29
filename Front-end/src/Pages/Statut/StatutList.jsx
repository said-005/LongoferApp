import { useQuery } from '@tanstack/react-query';
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { StatutColumns } from "./statutColumns";
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatutApi } from '../../Api/StatutApi';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useState } from 'react';

export default function StatutsList() {
    const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['statuts'],
    queryFn: StatutApi.getAll,
    onError: (error) => {
      toast.error("Erreur de chargement des statuts", {
        description: error.message || "Impossible de charger les statuts qualité",
      });
    }
  });

  const statuts = data?.data.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Statuts Qualité</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {statuts.length} {statuts.length === 1 ? 'statut' : 'statuts'} disponibles
          </p>
        </div>
        
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
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des statuts...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {error?.message || 'Impossible de charger les statuts qualité'}
          </AlertDescription>
        </Alert>
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