import { useState } from 'react';
import { DataTable } from "../../components/tubeList/data-table";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClientApi } from "../../Api/ClientApi";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClientColumns } from "./ClientColumns";
import { Input } from "@/components/ui/input"; // Add this import

export default function ClientsList() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { 
    data: clients, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Error loading clients", {
        description: error.message || "Please try again later",
      });
    }
  });

  const clientData = clients?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clients Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clientData.length} {clientData.length === 1 ? 'client' : 'clients'} in database
          </p>
        </div>
        <Button asChild>
          <Link to="/Client/AddClient" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add New Client</span>
          </Link>
        </Button>
      </div>
      
   
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Loading clients...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load clients data</AlertTitle>
          <AlertDescription>
            {error.message || "Unknown error"}
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
        <div className="overflow-hidden">
          <DataTable 
            columns={ClientColumns} 
            data={clientData}
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