import { MoreHorizontal, Trash2 } from "lucide-react";
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

import { useState } from "react";
import { toast } from "sonner";

import { useDeletePeinture_ext } from "./deletePeintureEXTHook";
import { UpdateSheet } from "../../Shette";
import UpdatePeintureExt from "./updatePeintureEXT";

export const PeintureExtColumns = [
  {
    accessorKey: "code_Peinture_Externe",
    header: "Code Peinture Externe",
    cell: ({ row }) => (
      <div className="font-medium uppercase text-xs sm:text-sm">
        {row.getValue("code_Peinture_Externe") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "date_Peinture_Externe",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date_Peinture_Externe");
      return (
        <div className="whitespace-nowrap text-xs sm:text-sm">
          {date ? new Date(date).toLocaleDateString() : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: "ref_production",
    header: "Référence",
    cell: ({ row }) => (
      <div className="font-mono uppercase text-xs sm:text-sm">
        {row.getValue("ref_production") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "machine",
    header: "Machine",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm">
        {row.getValue("machine") || '-'}
      </div>
    ),
  },
  {
    accessorKey: "statut",
    header: "Statut",
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
    accessorKey: 'Actions',
    header: '',
    cell: ({ row }) => {
      const peinture_ext = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate, isPending: isDeleting } = useDeletePeinture_ext();

      const handleDelete = () => {
        mutate(peinture_ext.code_Peinture_Externe , {
          onSuccess: () => {
            toast.success("Réparation supprimée avec succès");
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
                  Component={UpdatePeintureExt} 
                  id={peinture_ext.code_Peinture_Externe} 
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
                  Cette action supprimera définitivement cet enregistrement de peinture externe et ne peut pas être annulée.
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