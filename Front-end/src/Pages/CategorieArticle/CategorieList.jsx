import { DataTable } from "../../components/tubeList/data-table";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategorieApi } from './../../Api/CategorieApi';
import { CategorieColumns } from "./CategorieColumns";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { configurationQuery } from "../../configurationQueryClient/configuration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ListeCategories() {
   const [tri, setTri] = useState([]);
   const [filtreGlobal, setFiltreGlobal] = useState('');
    
  const { 
    data: reponseCategories, 
    isError: erreur, 
    error: detailErreur,
    isLoading: enChargement,
    refetch: recharger
  } = useQuery({
    queryKey: ['categories'],
    queryFn: CategorieApi.getAll,
    onError: (error) => {
      toast.error("Échec du chargement", {
        description: error.message || "Problème de connexion au serveur",
      });
    },
    ...configurationQuery
  });

  const categories = reponseCategories?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} {categories.length === 1 ? 'catégorie' : 'catégories'} existante{categories.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link 
            to={'/Categorie/AddCategorie'} 
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Catégorie</span>
          </Link>  
        </Button>
      </div>
      
      {enChargement ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement en cours...</span>
        </div>
      ) : erreur ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            Impossible de récupérer les catégories. {detailErreur?.response.data?.message || ''}
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => recharger()}
              >
                Réessayer
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="overflow-hidden">
          <DataTable 
            columns={CategorieColumns} 
            data={categories} 
            sorting={tri}
            onSortingChange={setTri}
            globalFilter={filtreGlobal}
            onGlobalFilterChange={setFiltreGlobal}
          />
        </div>
      )}
    </div>
  );
}