import { DataTable } from "../../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ReparationColumns } from "./ReparationColumns";
import { ReparationApi } from "../../../Api/ReparationApi";

export default function ReparationList() {
  // Fetch reparation data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reparations'],
    queryFn: ReparationApi.getAll,
    onError: (error) => {
      toast.error("Échec du chargement des réparations", {
        description: error.message,
      });
    },
    select: (response) => response?.data?.data || [],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:mt-20 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6 md:mt-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>Erreur lors du chargement des données</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6 mt-4 md:mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-2 md:gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Liste des Réparations</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion des réparations
          </p>
        </div>
        <Link 
          to={'/reparation/addReparation'} 
          className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-white font-medium sm:font-semibold text-sm sm:text-base text-center inline-flex items-center justify-center gap-1 sm:gap-2"
          aria-label="Ajouter une nouvelle réparation"
        >
          <span className="hidden sm:inline">+ Nouvelle Réparation</span>
          <span className="inline sm:hidden">+ Ajouter</span>
        </Link>  
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm overflow-x-auto">
        {data && data.length > 0 ? (
          <div className="min-w-[1024px] md:min-w-0">
            <DataTable 
              columns={ReparationColumns} 
              data={data||[]} 
              className="w-full"
            />
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
            Aucune réparation trouvée
          </div>
        )}
      </div>
    </div>
  );
}