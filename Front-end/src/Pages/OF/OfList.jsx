import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import OFcolumns from "./OFcolumns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { OfApi } from './../../Api/ofApi';
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { configurationQuery } from "../../configurationQueryClient/configuration";

export default function ListeOF() {
    const [tri, setTri] = useState([]);
    const [filtreGlobal, setFiltreGlobal] = useState('');
    
    const { 
        data: donneesOF, 
        isLoading: chargement, 
        isError: erreur, 
        error: erreurDetail, 
        refetch: recharger 
    } = useQuery({
        queryKey: ['ofs'],
        queryFn: OfApi.getAll,
        staleTime: 1000 * 60 * 5,
        onError: (error) => {
            toast.error("Échec du chargement des OF", {
                description: error.message || "Veuillez réessayer ultérieurement",
            });
        },
        ...configurationQuery
    });

    const ofs = donneesOF?.data?.data || [];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Gestion des Ordres de Fabrication</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {ofs.length} OF {ofs.length > 1 ? 'existants' : 'existant'}
                    </p>
                </div>
                <Button asChild>
                    <Link to={'/Of/AddOF'} className="inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Créer un OF</span>
                    </Link>  
                </Button>
            </div>
            
            {chargement ? (
                <div className="flex flex-col items-center justify-center h-64 gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Chargement en cours...</span>
                </div>
            ) : erreur ? (
                <Alert variant="destructive">
                    <AlertTitle>Erreur de chargement</AlertTitle>
                    <AlertDescription>
                        {erreurDetail.response?.data?.message || "Une erreur est survenue"}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => recharger()}
                        >
                            Recharger
                        </Button>
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="overflow-hidden">
                    <DataTable 
                        columns={OFcolumns} 
                        data={ofs} 
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