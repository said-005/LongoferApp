import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import  OFcolumns  from "./OFcolumns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { OfApi } from './../../Api/ofApi';
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function OFList() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    
  const { data: ofData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur lors du chargement des OF", {
        description: error.message || "Veuillez réessayer plus tard",
      });
    }
  });

  const ofs = ofData?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Liste des Ordres de Fabrication</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {ofs.length} OF enregistrés
          </p>
        </div>
        <Button asChild>
          <Link to={'/Of/AddOf'} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Nouvel OF</span>
          </Link>  
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Chargement des OF...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Impossible de charger les données</AlertTitle>
          <AlertDescription>
            {error.message || "Erreur inconnue"}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => refetch()}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={OFcolumns} 
            data={ofs} 
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