import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { ConsommationColumns } from "./consommationColumns";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConsommaationApi } from "../../Api/consommationApi";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ConsommationList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['consommations'],
    queryFn: ConsommaationApi.getAll,
    onError: (error) => {
      toast.error("Échec du chargement des consommations", {
        description: error.message,
      });
    },
    select: (response) => response?.data?.data || [],
  });
 
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
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertTitle>Erreur lors du chargement des données</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
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
          </p>
        </div>
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
      
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <DataTable 
          columns={ConsommationColumns} 
          data={data} 
          emptyState={
            <div className="p-8 text-center space-y-2">
              <p className="text-muted-foreground font-medium">Aucune consommation trouvée</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/consommation/AddConsommation" className="gap-2">
                  Ajouter votre première consommation
                </Link>
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}