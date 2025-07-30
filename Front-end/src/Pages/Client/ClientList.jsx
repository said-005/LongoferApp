import { useState } from 'react';
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClientApi } from "../../Api/ClientApi";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClientColumns } from "./ClientColumns";
import { Input } from "@/components/ui/input"; // Ajout de cette importation
import { configurationQuery } from '../../configurationQueryClient/configuration';

export default function ListeClients() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { 
    data: clients, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur lors du chargement des clients", {
        description: error.message || "Veuillez réessayer plus tard",
      });
    },
    ...configurationQuery
  });

  const clientData = clients?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clientData.length} {clientData.length === 1 ? 'client' : 'clients'} dans la base de données
          </p>
        </div>
        <Button asChild>
          <Link to="/Client/AddClient" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Ajouter un Client</span>
          </Link>
        </Button>
      </div>
      
   
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des clients...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Échec du chargement des données clients</AlertTitle>
          <AlertDescription>
            {error.response.data.message || "Erreur inconnue"}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => refetch()}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="overflow-hidden">
          <DataTable 
            columns={ClientColumns} 
            data={clientData}
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