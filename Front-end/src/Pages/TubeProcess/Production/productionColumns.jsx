import { MoreHorizontal, Trash2, ArrowUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useState } from "react";
import { toast } from "sonner";
import UpdateProduction from "./updateProduction";
import { useDeleteProduction } from "./deleteProductionHook";
import { UpdateSheet } from "../../Shette";

export const ProductionColumns = [
  {
    accessorKey: "production_code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
           Référence Production
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium uppercase">
        {row.getValue("production_code") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "date_production",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date_production");
      return (
        <div className="whitespace-nowrap">
          {date ? new Date(date).toLocaleDateString() : '-'}
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId));
      const dateB = new Date(rowB.getValue(columnId));
      return dateA - dateB;
    },
  },
  {
    accessorKey: "Num_OF",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            OF
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Filter className="ml-2 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <Input
                type="text"
                placeholder="Filter OF..."
                onChange={(e) => column.setFilterValue(e.target.value)}
                className="h-8"
              />
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("Num_OF") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "ref_article",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Reference Article
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("ref_article") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "qte_produite",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Quantity Produced
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono">
        {Number(row.getValue("qte_produite")) || 0}
      </div>
    ),
  },
  {
    accessorKey: "machine",
    header: "Machine",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("machine") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "statut",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("statut") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "defaut",
    header: "Defect",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("defaut") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "causse",
    header: "Cause",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("causse") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "soudeur",
    header: "soudeur",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("soudeur") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "operateur",
    header: "operateur",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("operateur") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "controleur",
    header: "controleur",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("controleur") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "description",
    header: "description",
    cell: ({ row }) => (
      <div className="font-mono uppercase text-xs sm:text-sm">
        {row.getValue("description") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const production = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate: deleteProduction, isPending: isDeleting } = useDeleteProduction();

      const handleDelete = () => {
        deleteProduction(production.production_code, {
          onSuccess: () => {
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to delete production", {
              description: error.message,
            });
          }
        });
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100"
                aria-label="Open actions menu"
                disabled={isDeleting}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <UpdateSheet 
                  Component={UpdateProduction} 
                  text="Edit Production" 
                  id={production.production_code}
                  data={production}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this production record and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : "Confirm Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
    
  }
];