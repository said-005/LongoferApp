import { MoreHorizontal, Trash } from "lucide-react";
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
import { UpdateSheet } from "../Shette";
import { useState } from "react";
import { useDeleteMatiere } from './deleteMatiereHook';
import { UpdateMatiere } from "./updateMatiere";
import { toast } from "sonner";

export const MatiereColumns = [
  {
    accessorKey: "code_matiere",
    header: "Code Matière",
    cell: ({ row }) => (
      <div className="font-medium capitalize">
        {row.getValue("code_matiere")}
      </div>
    ),
  },

  {
    accessorKey: "matiere",
    header: "Matiere",
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("matiere")}
      </div>
    ),
  },

  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const matiere = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate: deleteConsommation, isLoading: isDeleting } = useDeleteMatiere();

      const handleDelete = () => {
        deleteConsommation(matiere.code_matiere, {
          onSuccess: () => {
            toast.success("Matiere supprimée avec succès");
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
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100"
                aria-label="Actions menu"
                disabled={isDeleting}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <UpdateSheet 
                  Component={UpdateMatiere} 
                  text="Modifier Matiere" 
                  id={matiere.code_matiere} 
         
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash/>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement la Matiere.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="animate-pulse">Suppression en cours...</span>
                    </>
                  ) : "Confirmer la suppression"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  }
];