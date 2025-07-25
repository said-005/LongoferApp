import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import {StatutColumns}  from "./statutColumns";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { StatutApi } from '../../Api/StatutApi';
export default function StatutsList() {
  const queryClient = useQueryClient();

  // Fetch quality status data with React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['statuts'],
    queryFn: async () => {
        const response = await StatutApi.getAll();
        return response.data; // Adjust based on your API response structure
    },
    refetchInterval: 30000, // Auto-refetch every 30 seconds
    refetchOnWindowFocus: true,
    staleTime: 10000, // Data becomes stale after 10 seconds
  });

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Liste actualisée');
    } catch (err) {
      toast.error('Erreur lors de l\'actualisation');
    }
  };

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-medium">Erreur de chargement</h2>
          <p className="text-red-600 text-sm mt-1">
            {error?.message || 'Impossible de charger les statuts qualité'}
          </p>
          <Button 
            variant="outline" 
            className="mt-3"
            onClick={handleRefresh}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Statuts Qualité</h1>
          <p className="text-sm text-gray-500 mt-1">Liste des statuts qualité disponibles</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="gap-2"
            disabled={isLoading}
          >
            <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
            Actualiser
          </Button>
          
          <Link 
            to={'/statut/AddStatut'} 
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold"
          >
            <span>+ Ajouter Statut</span>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <DataTable 
          columns={StatutColumns} 
          data={data.data || []} 
          className="w-full"
        />
      </div>
    </div>
  );
}