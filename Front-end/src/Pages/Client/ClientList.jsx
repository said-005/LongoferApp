import { DataTable } from "../../components/tubeList/data-table";
import { Loader2, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import { ClientApi } from "../../Api/ClientApi";
import { ClientColumns } from "./ClientColumns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function ClientsList() {
  const {
    data: clients = [],
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: () => ClientApi.getAll(),
  });
  return (
    <div className="container mx-auto px-4 mt-20 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clients Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'} in database
          </p>
        </div>
        <Button asChild>
          <Link 
            to="/Client/AddClient" 
            className="inline-flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Client
          </Link>
        </Button>
      </div>
      
      {isFetching ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="text-gray-500">Loading clients...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          
          <AlertTitle>Error loading clients</AlertTitle>
          <AlertDescription>
            {error.message || 'Failed to fetch clients data'}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={ClientColumns} 
            data={clients.data.data} 
            emptyState={
              <div className="p-8 text-center space-y-2">
                <p className="text-gray-500 font-medium">No clients found</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/Client/AddClient" className="gap-2">
                    <Plus className="h-3 w-3" />
                    Add your first client
                  </Link>
                </Button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}