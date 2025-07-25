import { DataTable } from "../../components/tubeList/data-table";
import { MoreHorizontal, Loader2, Plus, Copy, Edit, Trash2 } from "lucide-react";

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CausseApi } from "../../Api/causseApi";
import { Caussecolumns } from "./causseColumns";

export default function CausseList() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['causses'],
    queryFn: CausseApi.getAll,
  });

  return (
    <div className="container mx-auto px-4 py-6 mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Causse Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data?.length || 0} {data?.length === 1 ? 'article' : 'articles'} in database
          </p>
        </div>
        <Link 
          to="/causse/AddCausse" 
          className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Causse
        </Link>  
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>Loading Causse...</span>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error.message}
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={Caussecolumns} 
            data={data.data.data || []} 
            emptyState={
              <div className="p-8 text-center">
                <p className="text-gray-500">No Causse found</p>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}