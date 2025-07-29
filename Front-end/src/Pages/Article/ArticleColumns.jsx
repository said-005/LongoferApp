import { toast } from "sonner";
import { MoreHorizontal, Copy, Edit, Trash2, EyeOff, ArrowUpDown  } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { UpdateArticle } from "./updateArticals";
import { UpdateSheet } from "../Shette";
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
import { useDeleteArticle } from "./delteArticleHook";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => toast.success("Copié dans le presse-papiers"))
    .catch(() => toast.error("Échec de la copie"));
};

export const Articlecolumns = [
  {
    accessorKey: "codeArticle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Code Article
          <ArrowUpDown  className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium whitespace-nowrap">
        {row.getValue("codeArticle")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "categorie",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Catégorie
          <ArrowUpDown  className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("categorie")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "ArticleName",
    header: "Désignation",
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {row.getValue("ArticleName")}
      </div>
    ),
  },
  {
    accessorKey: "Diametre",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Diamètre
          <ArrowUpDown  className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("Diametre")}
      </div>
    ),
  },
  {
    accessorKey: "Epaisseur",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Épaisseur
          <ArrowUpDown  className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("Epaisseur")}
      </div>
    ),
  },
  {
    accessorKey: "Poids",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Poids
          <ArrowUpDown  className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("Poids")}
      </div>
    ),
  },
  {
    accessorKey: "Unite_Stock",
    header: "Unité Stock",
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("Unite_Stock")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const article = row.original;
      const { mutate:deleteArticle, isDeleting } = useDeleteArticle();

      const handleDelete = async () => {
        try {
          await deleteArticle(article.codeArticle);
          toast.success("Article supprimé avec succès");
        } catch (error) {
          toast.error("Échec de la suppression", {
            description: error.message,
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-gray-200"
              aria-label="Menu des actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            <DropdownMenuItem
              onClick={() => handleCopy(article.codeArticle)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier le code
            </DropdownMenuItem>
            
            <UpdateSheet 
              id={article.codeArticle} 
              Component={UpdateArticle} 
              text="Modifier l'article"
            />
            
            <DropdownMenuSeparator />
            
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
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
                    Êtes-vous sûr de vouloir supprimer l'article {article.codeArticle} ? 
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
    enableHiding: false,
  }
];