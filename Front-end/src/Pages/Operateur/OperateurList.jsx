import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { OperateurColumns } from "./operateurColumns";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { OperateurApi } from '../../Api/operateurApi';

export default function OperatorList() {
  const queryClient = useQueryClient();

  // Fetch operators data with React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['operateurs'],
    queryFn: async () => {
      return OperateurApi.getAll()
    },
    refetchOnWindowFocus:true
  
  });

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['operateurs'] });
      toast.success('Liste actualisée');
    } catch (err) {
      toast.error('Erreur lors de l\'actualisation');
    }
  };
console.log(data)
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
          <p className="text-red-600 text-sm mt-1">{error?.message || 'Impossible de charger les données'}</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Opérateurs</h1>
          <p className="text-sm text-gray-500 mt-1">Liste des opérateurs et leurs affectations</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
            Actualiser
          </Button>
          
          <Link 
            to={'/operateur/AddOperateur'} 
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold"
          >
            <span>+ Ajouter Opérateur</span>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <DataTable 
          columns={OperateurColumns} 
          data={data?.data?.data || []} 
          className="w-full"
        />
      </div>
    </div>
  );
}