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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { UpdateCategorie } from "./updateCategorie";
import { toast } from "sonner";
import { UpdateSheet } from './../Shette';
import { useDeleteCategorie } from "./deleteCategorieHook";
export const CategorieColumns = [
  {
    accessorKey: "CategorieArticle",
    header: "Articel categorie",
    cell: ({ row }) => (
      <div className="font-medium capitalize">
        {row.getValue("CategorieArticle")}
      </div>
    ),
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const categorie = row.original;
      const { mutate: deleteCategorie, isPending: isDeleting } = useDeleteCategorie();

      const handleDelete = async () => {
        try {
          await deleteCategorie(categorie.CategorieArticle );
          toast.success("Catégorie supprimée avec succès");
        } catch (error) {
          toast.error("Échec de la suppression", {
            description: error instanceof Error ? error.message : "Une erreur inconnue est survenue",
          });
        }
      };

      return (
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
            <UpdateSheet Component={UpdateCategorie} id={categorie.CategorieArticle}/>

            <DropdownMenuSeparator />
            
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer la catégorie "{categorie.Categorie}" ?
                    Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Annuler</Button>
                  </DialogClose>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Trash2 className="mr-2 h-4 w-4 animate-pulse" />
                        Suppression...
                      </>
                    ) : "Confirmer"}
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