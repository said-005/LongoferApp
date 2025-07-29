import { MoreHorizontal, Sheet, Trash, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent"
      >
        Statut
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Statut")}</div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const statut = row.original;
      const { mutate: deleteOperateur, isPending } = useDeleteStatut();
      const [open, setOpen] = useState(false);

      const handleDelete = () => {
        toast.promise(
          () => new Promise((resolve, reject) => {
            deleteOperateur(statut.Statut, {
              onSuccess: () => {
                resolve();
                setOpen(false);
              },
              onError: reject
            });
          }),
          {
            loading: "Suppression en cours...",
            success: "Statut supprimé avec succès",
            error: (err) => err.message || "Erreur lors de la suppression"
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
                  text="Modifier le statut"
                  id={statut.Statut}
                  className="w-full"
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer" 
                onClick={() => setOpen(true)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Vous êtes sur le point de supprimer le statut : 
                  <span className="font-semibold"> "{statut.Statut}"</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600" 
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Trash className="w-4 h-4 mr-2 animate-pulse" />
                      Suppression...
                    </>
                  ) : "Confirmer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  }
];

