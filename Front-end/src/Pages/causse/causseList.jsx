import { DataTable } from "../../components/tubeList/data-table";
import { Plus, Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CausseApi } from "../../Api/causseApi";
import { Caussecolumns } from "./causseColumns";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function CausseList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['causses'],
    queryFn: CausseApi.getAll,
    onError: (error) => {
      toast.error("Failed to load causses", {
        description: error.message,
      });
    },
    select: (response) => response?.data?.data || [],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Causse Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data?.length || 0} {data?.length === 1 ? 'causse' : 'causses'} in database
          </p>
        </div>
        <Button asChild>
          <Link 
            to="/causse/AddCausse" 
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Causse
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Loading causses...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Error loading causses</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={Caussecolumns} 
            data={data} 
            emptyState={
              <div className="p-8 text-center space-y-2">
                <p className="text-muted-foreground font-medium">No causses found</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/causse/AddCausse" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add your first causse
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