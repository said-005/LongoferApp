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

export default function ArticleList() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    onError: (error) => {
      toast.error("Failed to load articles", {
        description: error.message,
      });
    }
  });

  const articles = data?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Article Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'} in database
          </p>
        </div>
        <Button asChild>
          <Link 
            to="/article/AddArticle" 
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Article
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Loading articles...</span>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Error loading articles</AlertTitle>
          <AlertDescription>
            {error.message}
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
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <DataTable 
              columns={Articlecolumns} 
              data={articles} 
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