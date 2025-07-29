import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateSheet } from "../Shette";
import { UpdateDefaut } from "./updateDefaut";
import { MoreHorizontal, Trash, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useDeleteDefaut } from "./deleteDefautHook";
import { Input } from "@/components/ui/input";

export const Defautcolumns = [
  {
    accessorKey: "codeDefaut",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Code Défaut
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium uppercase tracking-wider">
        {row.getValue("codeDefaut")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "defautDescription",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent min-w-[200px]"
      >
        Description du Défaut
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-[200px]">
        {row.getValue("defautDescription")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const defaut = row.original;
      const { mutate: deleteDefaut, isPending: isDeleting } = useDeleteDefaut();

      const handleDelete = async () => {
        try {
          await deleteDefaut(defaut.codeDefaut);
          toast.success("Défaut supprimé avec succès");
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
              disabled={isDeleting}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <UpdateSheet 
                Component={UpdateDefaut} 
                id={defaut.codeDefaut} 
                text="Modifier les informations" 
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer le défaut {defaut.codeDefaut} ?
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
                        <Trash className="mr-2 h-4 w-4 animate-pulse" />
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
