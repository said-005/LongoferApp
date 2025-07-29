import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { OperateurColumns } from "./operateurColumns";
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { OperateurApi } from '../../Api/operateurApi';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from 'react';

export default function OperatorList() {
    const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['operateurs'],
    queryFn: OperateurApi.getAll,
    refetchOnWindowFocus: true
  });

  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['operateurs'] });
      toast.success('Liste actualisée');
    } catch (err) {
      toast.error('Erreur lors de l\'actualisation');
    }
  };

  const operators = data?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Opérateurs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {operators.length} {operators.length === 1 ? 'opérateur' : 'opérateurs'} enregistrés
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild>
            <Link 
              to={'/operateur/AddOperateur'} 
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter Opérateur</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des opérateurs...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {error?.message || 'Impossible de charger les données'}
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={handleRefresh}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={OperateurColumns} 
            data={operators} 
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