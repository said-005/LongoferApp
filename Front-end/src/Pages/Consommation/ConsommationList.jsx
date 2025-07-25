import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';

import { ConsommationColumns } from "./consommationColumns";
import { useQuery } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConsommaationApi } from "../../Api/consommationApi";

export default function ConsommationList() {
  // Fetch consumption data
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
      <div className="container mx-auto px-4 py-6 mt-20 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6 mt-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>Erreur lors du chargement des données</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Liste des Consommations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion des consommations de matières premières
          </p>
        </div>
        <Link 
          to={'/consommation/AddConsommation'} 
          className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
          aria-label="Ajouter une nouvelle consommation"
        >
          <span>+ Nouvelle Consommation</span>
        </Link>  
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm overflow-hidden">
        {data && data.length > 0 ? (
          <DataTable 
            columns={ConsommationColumns} 
            data={data} 
            className="w-full"
          />
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucune consommation trouvée
          </div>
        )}
      </div>
    </div>
  );
}