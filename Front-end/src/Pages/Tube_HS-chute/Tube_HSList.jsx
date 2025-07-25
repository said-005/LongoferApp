import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { TubeSHcolumns } from "./Tube_HS_chuteColumns";
import { PlusIcon, Loader2 } from "lucide-react";
import { TubeHSApi } from "../../Api/TubeHSApi";
import { toast } from "sonner";

export default function TubeHSList() {
  const { 
    data: tubeHSData = [], // Default to empty array
    isLoading, 
    isError, 
    error,
    isRefetching 
  } = useQuery({
    queryKey: ['tube_HSs'],
    queryFn: async () => {
        const response = await TubeHSApi.getAll();
        return response.data.data || []; // Ensure array is returned
    },
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur de chargement des tubes HS", {
        description: error.message,
      });
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 mt-20 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6 mt-20">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Erreur lors du chargement des données: {error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Tubes Hors-Service</h1>
          <p className="text-sm text-gray-500 mt-1">Suivi des chutes et rebuts de production</p>
        </div>
        <div className="flex items-center gap-3">
          {isRefetching && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          )}
          <Link 
            to="/TubeHS/AddTubeHS" 
            className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nouvelle Entrée</span>
          </Link>  
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <DataTable 
          columns={TubeSHcolumns} 
          data={tubeHSData} 
          className="w-full"
          noDataMessage="Aucun résultat trouvé" // Add this prop
        />
      </div>
    </div>
  );
}