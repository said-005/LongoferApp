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
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import { toast } from "sonner";
import { useDeleteManchette } from "./deleteManchetteHook";
import { UpdateSheet } from "../../Shette";
import UpdateManchette from "./updateManchette";

export const ManchetteColumns = [
  {
    accessorKey: "code_Manchette",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-xs sm:text-sm"
        >
          Référence Manchette
          <ArrowUpDown className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium uppercase text-xs sm:text-sm">
        {row.getValue("code_Manchette") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "date_Manchette",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-xs sm:text-sm"
        >
          Date
          <ArrowUpDown className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date_Manchette");
      return (
        <div className="whitespace-nowrap text-xs sm:text-sm">
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
    accessorKey: "ref_production",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 text-xs sm:text-sm"
          >
            Référence
            <ArrowUpDown className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Filter className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="w-40">
              <Input
                type="text"
                placeholder="Filtrer référence..."
                onChange={(e) => column.setFilterValue(e.target.value)}
                className="h-7 text-xs sm:text-sm"
              />
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono uppercase text-xs sm:text-sm">
        {row.getValue("ref_production") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "machine",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-xs sm:text-sm"
        >
          Machine
          <ArrowUpDown className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm">
        {row.getValue("machine") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-xs sm:text-sm"
        >
          Statut
          <ArrowUpDown className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const statut = row.getValue("statut");
      const variant = statut === "terminé" ? "default" : 
                     statut === "en cours" ? "secondary" : "outline";
      return (
        <Badge variant={variant} className="text-xs sm:text-sm capitalize">
          {statut || '-'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "defaut",
    header: () => <span className="text-xs sm:text-sm">Défaut</span>,
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden md:block">
        {row.getValue("defaut") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "causse",
    header: () => <span className="text-xs sm:text-sm">Cause</span>,
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden lg:block">
        {row.getValue("causse") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "soudeur",
    header: () => <span className="text-xs sm:text-sm">Soudeur</span>,
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden xl:block">
        {row.getValue("soudeur") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "operateur",
    header: () => <span className="text-xs sm:text-sm">Opérateur</span>,
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden 2xl:block">
        {row.getValue("operateur") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "controleur",
    header: () => <span className="text-xs sm:text-sm">Contrôleur</span>,
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden 2xl:block">
        {row.getValue("controleur") || '-'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "description",
    header: () => <span className="text-xs sm:text-sm">Description</span>,
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
    header: '',
    cell: ({ row }) => {
      const manchette = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate, isPending: isDeleting } = useDeleteManchette();

      const handleDelete = () => {
        mutate(manchette.code_Manchette, {
          onSuccess: () => {
          
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            toast.error("Échec de la suppression", {
              description: error.message,
            });
          }
        });
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-gray-100 sm:h-8 sm:w-8"
                aria-label="Ouvrir le menu des actions"
                disabled={isDeleting}
              >
                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel className="text-xs sm:text-sm">Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild className="text-xs sm:text-sm">
                <UpdateSheet
                  Component={UpdateManchette} 
                  id={manchette.code_Manchette} 
                  text="Modifier les informations"
                  data={manchette}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer text-xs sm:text-sm"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="max-w-[95%] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-sm sm:text-base">Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm">
                  Cette action supprimera définitivement cet enregistrement de manchette et ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting} className="text-xs sm:text-sm">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-xs sm:text-sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Suppression...
                    </span>
                  ) : "Confirmer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  }
];