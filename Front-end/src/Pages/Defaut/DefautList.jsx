import { DataTable } from "../../components/tubeList/data-table";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DefautApi } from "../../Api/defautApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Defautcolumns } from "./defautColumns";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function DefautList() {
   const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { data: defauts, isLoading, isError, error } = useQuery({
    queryKey: ['defauts'],
    queryFn: DefautApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isError) {
    toast.error("Erreur lors du chargement des défauts", {
      description: error.message || "Veuillez réessayer plus tard",
    });
  }

  const defautsData = defauts?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Défauts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {defautsData.length} {defautsData.length === 1 ? 'défaut' : 'défauts'} enregistrés
          </p>
        </div>
        <Button asChild>
          <Link 
            to={'/defaut/AddDefaut'}
            className="inline-flex items-center gap-2"
          >
            <span>+ Ajouter Défaut</span>
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <div className="p-6 text-center text-destructive">
          Erreur lors du chargement des données. Veuillez réessayer.
        </div>
      ) : (
        <div className=" overflow-hidden">
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