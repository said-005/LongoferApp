import { DataTable } from "../../components/tubeList/data-table";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DefautApi } from "../../Api/defautApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Defautcolumns } from "./defautColumns";

export default function DefautList() {
  // Fetch defauts data with React Query
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

  return (
    <div className="container mx-auto mt-20 px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Défauts</h1>
          <p className="text-sm text-gray-500 mt-1">Liste des défauts qualité enregistrés</p>
        </div>
        <Link 
          to={'/defaut/AddDefaut'} 
          className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
        >
          <span>+ Ajouter Défaut</span>
        </Link>  
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            Erreur lors du chargement des données. Veuillez réessayer.
          </div>
        ) : (
          <DataTable 
            columns={Defautcolumns} 
            data={defauts.data.data || []} 
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}