import { MoreHorizontal, Sheet, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateStatut } from "./updateStatut";
import { UpdateSheet } from "../Shette";
import { useDeleteStatut } from './delteStatutHook';
import { toast } from 'sonner';
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

export const StatutColumns = [
  {
    accessorKey: "Statut",
    header: " tube Statut",
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const statut = row.original;
      const { mutate: deleteOperateur, isPending } = useDeleteStatut();
      const [open, setOpen] = useState(false);
      const handleDelete = () => {
        toast.promise(
          () => new Promise((resolve, reject) => {
            deleteOperateur(statut.Statut, {
              onSuccess: resolve,
              onError: reject
            });
          }),
          {
            loading: "Suppression en cours...",
            success: () => {
              return "Opérateur supprimé avec succès";
            },
            error: (err) => {
              return err.message || "Erreur lors de la suppression";
            }
          }
        );
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100"
                aria-label="Menu des actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <UpdateSheet 
                  Component={UpdateStatut}
                  text="update Statut "
                  id={statut.Statut}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer" 
                onClick={() => setOpen(true)}
              >
                <Trash className="w-4 "/>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Vous êtes sur le point de supprimer le statut "{statut.Statut}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    },
  }
];