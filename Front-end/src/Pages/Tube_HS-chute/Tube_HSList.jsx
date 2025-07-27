import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { TubeSHcolumns } from "./Tube_HS_chuteColumns";
import { Plus, Loader2 } from "lucide-react";
import { TubeHSApi } from "../../Api/TubeHSApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TubeHSList() {
  const { 
    data: tubeHSData = [],
    isLoading, 
    isError, 
    error,
    isRefetching,
    refetch
  } = useQuery({
    queryKey: ['tube_HSs'],
    queryFn: async () => {
      const response = await TubeHSApi.getAll();
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur de chargement des tubes HS", {
        description: error.message,
      });
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Tubes Hors-Service</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tubeHSData.length} {tubeHSData.length === 1 ? 'entrée' : 'entrées'} enregistrées
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isRefetching && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <Button asChild>
            <Link 
              to="/TubeHS/AddTubeHS"
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle Entrée</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des données...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {error.message}
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
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={TubeSHcolumns} 
            data={tubeHSData} 
            emptyState={
              <div className="p-8 text-center space-y-2">
                <p className="text-muted-foreground font-medium">Aucune entrée trouvée</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/TubeHS/AddTubeHS" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter votre première entrée
                  </Link>
                </Button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}