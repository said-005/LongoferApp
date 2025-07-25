import { DataTable } from "../../components/tubeList/data-table";

import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CategorieApi } from './../../Api/CategorieApi';
import { CategorieColumns } from "./CategorieColumns";

export default function CategorieList() {
  // Fetch categories data with React Query
  const { data: categoriesResponse, isLoading, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: CategorieApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isError) {
    toast.error("Erreur lors du chargement des catégories", {
      description: error instanceof Error ? error.message : "Veuillez réessayer plus tard",
    });
  }

  // Extract categories data from response
  const categories = categoriesResponse?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6 mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Liste des Catégories</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des catégories d'articles</p>
        </div>
        <Link 
          to={'/Categorie/AddCategorie'} 
          className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-md px-4 py-2 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
        >
          <span>+ Ajouter une Catégorie</span>
        </Link>  
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-full" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            Erreur lors du chargement des données. Veuillez réessayer.
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucune catégorie trouvée.
            <Link 
              to={'/Categorie/AddCategorie'} 
              className="block mt-4 text-blue-600 hover:text-blue-800"
            >
              Créer une nouvelle catégorie
            </Link>
          </div>
        ) : (
          <DataTable 
            columns={CategorieColumns} 
            data={categories} 
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}