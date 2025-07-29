import { DataTable } from "../../../components/tubeList/data-table";
import { Link } from 'react-router-dom';


import { useQuery } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ProductionApi } from "../../../Api/ProductionApi";
import { ProductionColumns } from "./productionColumns";
import { useState } from "react";

export default function ProductionList() {
   const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Fetch consumption data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['productions'],
    queryFn: ProductionApi.getAll,
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Liste des Productions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion des Productions
          </p>
        </div>
        <Link 
          to={'/production/addProduction'} 
          className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
          aria-label="Ajouter une nouvelle consommation"
        >
          <span>+ Nouvelle Production</span>
        </Link>  
      </div>
      
      <div className="  overflow-hidden">
        {data && data.length > 0 ? (
          <DataTable 
            columns={ProductionColumns} 
            data={data||[]} 
            sorting={sorting}
              onSortingChange={setSorting}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
            className="w-full"
          />
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucune Production trouvée
          </div>
        )}
      </div>
    </div>
  );
}