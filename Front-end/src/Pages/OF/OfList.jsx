import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { OFcolumns } from "./OFcolumns";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { OfApi } from './../../Api/ofApi';
export default function OFList() {
  // Fetch OF data with React Query
  const { data: ofData, isLoading, isError, error } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5,// 5 minutes cache

  });

  if (isError) {
    toast.error("Erreur lors du chargement des OF", {
      description: error.message || "Veuillez réessayer plus tard",
    });
  }

  return (
    <div className="container mx-auto px-4 mt-20 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Liste des Ordres de Fabrication</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des OF en cours</p>
        </div>
        <Link 
          to={'/Of/AddOf'} 
          className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
        >
          <span>+ Nouvel OF</span>
        </Link>  
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            Erreur lors du chargement des données. Veuillez réessayer.
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <DataTable 
            columns={OFcolumns} 
            data={ofData.data.data || []} 
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}