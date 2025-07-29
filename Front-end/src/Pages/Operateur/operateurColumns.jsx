import { ArrowUp, ArrowDown, ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateOperateur } from "./UpdateOperateur";
import { UpdateSheet } from "../Shette";
import { useDeleteOperateur } from "./delteOperateurHook";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

export const OperateurColumns = [
  {
    accessorKey: "operateur",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Code Opérateur
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
      <div className="font-medium">
        {row.getValue("operateur")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "nom_complete",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Nom Complet
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
      <div className="capitalize">
        {row.getValue("nom_complete")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "Fonction",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Fonction
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
      <div className="font-mono">
        {row.getValue("Fonction")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    id: "machineInfo",
    header: "Machine",
    cell: ({ row }) => {
      const machine = row.original.machine;
      return (
        <div className="whitespace-nowrap">
          {machine 
            ? `${machine.MachineName} -- (${machine.codeMachine})`
            : "Non affectée"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const machine = row.original.machine;
      if (!machine) return "Non affectée".toLowerCase().includes(value.toLowerCase());
      return `${machine.MachineName} ${machine.codeMachine}`.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const operateur = row.original;
      const { mutate: deleteOperateur, isPending } = useDeleteOperateur();
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      
      const handleDelete = () => {
        toast.promise(
          () => new Promise((resolve, reject) => {
            deleteOperateur(operateur.operateur, {
              onSuccess: () => {
                resolve();
                setIsDialogOpen(false);
              },
              onError: reject
            });
          }),
          {
            loading: "Suppression en cours...",
            success: () => `Opérateur ${operateur.nom_complete} supprimé avec succès`,
            error: (err) => err.response?.data?.message || "Erreur lors de la suppression"
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
                disabled={isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <UpdateSheet 
                Component={UpdateOperateur} 
                id={operateur.operateur}
                text="Mettre à jour l'opérateur"
                className="w-full"
              />
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer" 
                onClick={() => setIsDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Vous allez supprimer :
                  <div className="mt-2 space-y-1">
                    <p className="font-medium">• Opérateur: {operateur.nom_complete}</p>
                    <p className="font-medium">• Code: {operateur.operateur}</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Trash2 className="mr-2 h-4 w-4 animate-pulse" />
                      Suppression...
                    </>
                  ) : "Confirmer la suppression"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  }
];
