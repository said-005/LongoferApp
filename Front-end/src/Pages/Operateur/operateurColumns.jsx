import { UpdateOperateur } from "./UpdateOperateur";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateSheet } from "../Shette";
import { MoreHorizontal, Trash2, Edit, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";

export const OperateurColumns = [
  {
    accessorKey: "operateur",
    header: "Code Opérateur",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("operateur")}
      </div>
    ),
  },
  {
    accessorKey: "nom_complete",
    header: "Nom Complet",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("nom_complete")}
      </div>
    ),
  },
  {
    accessorKey: "Fonction",
    header: "Fonction",
    cell: ({ row }) => (
      <div className="font-mono">
        {row.getValue("Fonction")}
      </div>
    ),
  },
  {
    accessorKey: "Machine",
    header: "Machine",
    cell: ({ row }) => (
      <div>
        {row.getValue("Machine") || "Non affectée"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const operateur = row.original 
      const { mutate: deleteOperateur, isPending } = useDeleteOperateur();
      
      const handleDelete = () => {
        toast.promise(
          () => new Promise((resolve, reject) => {
            deleteOperateur(operateur.operateur, {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-gray-100"
              aria-label="Menu des actions"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading-spinner"></span>
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
             
            <UpdateSheet 
              Component={UpdateOperateur} 
              id={operateur.operateur}
              text={"mis a jour l'operateur"}
            />
            
            <DropdownMenuSeparator />
            
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Supprimer</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                  <DialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement l'opérateur "{operateur.nom_complete}".
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Annuler</Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    {isPending ? "Suppression..." : "Supprimer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];