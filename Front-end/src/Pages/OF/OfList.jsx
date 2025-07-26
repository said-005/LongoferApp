import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { OFcolumns } from "./OFcolumns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { OfApi } from './../../Api/ofApi';
import { Button } from "@/components/ui/button";

export default function OFList() {
  // Fetch OF data with React Query
  const { data: ofData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isError) {
    toast.error("Erreur lors du chargement des OF", {
      description: error.message || "Veuillez réessayer plus tard",
    });
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Liste des Ordres de Fabrication</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion des OF en cours</p>
        </div>
        <Button asChild>
          <Link 
            to={'/Of/AddOf'} 
            className="inline-flex items-center gap-2"
          >
            <span>+ Nouvel OF</span>
          </Link>  
        </Button>
      </div>
      
      <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-full bg-muted" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <p className="text-destructive mb-4">
              Erreur lors du chargement des données. Veuillez réessayer.
            </p>
            <Button 
              variant="outline"
              onClick={() => refetch()}
            >
              Réessayer
            </Button>
          </div>
        ) : (
          <DataTable 
            columns={OFcolumns} 
            data={ofData?.data?.data || []} 
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}