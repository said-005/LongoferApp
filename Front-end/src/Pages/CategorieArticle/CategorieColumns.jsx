import { useRef } from 'react';
import { MoreHorizontal, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Copy } from "lucide-react";
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

const handleCopy = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => toast.success("Copié dans le presse-papiers"))
    .catch(() => toast.error("Échec de la copie"));
};

export const CategorieColumns = [
  {
    accessorKey: "CategorieArticle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Catégorie d'Article
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium capitalize" title={row.getValue("CategorieArticle")}>
        {row.getValue("CategorieArticle")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    id: "actions",
    header: 'Actions',
    cell: ({ row }) => {
      const categorie = row.original;
      const { mutate: deleteCategorie, isPending: isDeleting } = useDeleteCategorie();
      const dialogCloseRef = useRef(null);

      const handleDelete = async () => {
        try {
          await deleteCategorie(categorie.CategorieArticle);
          toast.success("Catégorie supprimée avec succès");
          dialogCloseRef.current?.click();
        } catch (error) {
          toast.error("Échec de la suppression", {
            description: error.response?.data?.message || "Une erreur est survenue",
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
            
            <DropdownMenuItem
              onClick={() => handleCopy(categorie.CategorieArticle)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier le nom
            </DropdownMenuItem>
            
            <UpdateSheet 
              Component={UpdateCategorie} 
              id={categorie.CategorieArticle}
              text="Modifier la catégorie"
            />

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
                    Êtes-vous sûr de vouloir supprimer la catégorie <strong>"{categorie.CategorieArticle}"</strong> ?
                    Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" ref={dialogCloseRef}>Annuler</Button>
                  </DialogClose>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="min-w-24"
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