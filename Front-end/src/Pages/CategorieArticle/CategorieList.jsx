import { DataTable } from "../../components/tubeList/data-table";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategorieApi } from './../../Api/CategorieApi';
import { CategorieColumns } from "./CategorieColumns";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CategorieList() {
   const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    
  const { 
    data: categoriesResponse, 
    isError, 
    error,
    isLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: CategorieApi.getAll,
  });

  if (isError) {
    toast.error("Erreur lors du chargement des catégories", {
      description: error instanceof Error ? error.message : "Veuillez réessayer plus tard",
    });
  }

  const categories = categoriesResponse?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Liste des Catégories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} {categories.length === 1 ? 'catégorie' : 'catégories'} enregistrées
          </p>
        </div>
        <Button asChild>
          <Link 
            to={'/Categorie/AddCategorie'} 
            className="inline-flex items-center gap-2"
          >
            <span>+ Ajouter une Catégorie</span>
          </Link>  
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>Chargement des catégories...</span>
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={CategorieColumns} 
            data={categories} 
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