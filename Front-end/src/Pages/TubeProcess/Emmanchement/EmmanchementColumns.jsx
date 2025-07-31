import { MoreHorizontal, Trash2, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
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

import { useState } from "react";
import { toast } from "sonner";

import { useDeleteEmmanchement } from "./deleteEmmanchementHook";
import { UpdateSheet } from "../../Shette";
import UpdateEmmanchement from "./updateEmmanchement";

export const EmmanchementColumns = [
  {
    accessorKey: "code_Emmanchement",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Référence Réparation
          <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium uppercase text-xs sm:text-sm">
        {row.getValue("code_Emmanchement") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "date_Emmanchement",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date_Emmanchement");
      return (
        <div className="whitespace-nowrap text-xs sm:text-sm">
          {date ? new Date(date).toLocaleDateString() : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: "ref_production",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Référence
          <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono uppercase text-xs sm:text-sm">
        {row.getValue("ref_production") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "machine",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Machine
          <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm">
        {row.getValue("machine") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "statut",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Statut
          <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm">
        {row.getValue("statut") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "defaut",
    header: "Défaut",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden md:block">
        {row.getValue("defaut") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "causse",
    header: "Cause",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden lg:block">
        {row.getValue("causse") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "soudeur",
    header: "Soudeur",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden xl:block">
        {row.getValue("soudeur") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "operateur",
    header: "Opérateur",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden 2xl:block">
        {row.getValue("operateur") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "controleur",
    header: "Contrôleur",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden 2xl:block">
        {row.getValue("controleur") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-mono uppercase text-xs sm:text-sm">
        {row.getValue("description") || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'Actions',
    header: '',
    cell: ({ row }) => {
      const emmanchement = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate, isPending: isDeleting } = useDeleteEmmanchement();

      const handleDelete = () => {
        mutate(emmanchement.code_Emmanchement, {
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
                  Component={UpdateEmmanchement} 
                  id={emmanchement.code_Emmanchement} 
                  text="Modifier les informations"
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
                  Cette action supprimera définitivement cet enregistrement de Emmanchement et ne peut pas être annulée.
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
