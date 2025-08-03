import { DataTable } from "../../components/tubeList/data-table";
import { Loader2, Plus, Search } from "lucide-react";
import { Link } from 'react-router-dom';
import { Articlecolumns } from "./ArticleColumns";
import { useQuery } from '@tanstack/react-query';
import { ArticleApi } from "../../Api/ArticleApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { configurationQuery } from "../../configurationQueryClient/configuration";

export default function ListeArticles() {
  const [tri, setTri] = useState([]);
  const [filtreGlobal, setFiltreGlobal] = useState('');
  
  const { 
    data: donnees, 
    isLoading: enChargement, 
    isError: erreur, 
    error: erreurDetail, 
    refetch: recharger 
  } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    onError: (error) => {
      toast.error("Échec du chargement des articles", {
        description: error.message,
      });
    },
    ...configurationQuery
  });

  const articles = donnees?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Articles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {articles.length} article{articles.length > 1 ? 's' : ''} enregistré{articles.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link 
            to="/article/AddArticle" 
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un article
          </Link>
        </Button>
      </div>
      
      {enChargement ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des articles...</span>
        </div>
      ) : erreur ? (
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {erreurDetail?.response?.data?.message}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => recharger()}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
          <div className="overflow-hidden">
            <DataTable 
              columns={Articlecolumns} 
              data={articles} 
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