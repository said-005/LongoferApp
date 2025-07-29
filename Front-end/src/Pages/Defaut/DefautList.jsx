import { DataTable } from "../../components/tubeList/data-table";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DefautApi } from "../../Api/defautApi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Defautcolumns } from './defautColumns';
export default function DefautList() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { 
    data: defauts, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['defauts'],
    queryFn: DefautApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isError) {
    toast.error("Erreur lors du chargement des défauts", {
      description: error.message || "Veuillez réessayer plus tard",
      action: {
        label: "Réessayer",
        onClick: () => refetch(),
      },
    });
  }

  const defautsData = defauts?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Défauts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Chargement...
              </span>
            ) : (
              `${defautsData.length} ${defautsData.length === 1 ? 'défaut' : 'défauts'} enregistrés`
            )}
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
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Chargement des données...
          </p>
        </div>
      ) : isError ? (
        <div className="p-6 text-center text-destructive">
          Erreur lors du chargement des données. 
          <Button variant="ghost" onClick={() => refetch()} className="ml-2">
            Réessayer
          </Button>
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