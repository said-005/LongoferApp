import { toast } from "sonner";
import { MoreHorizontal, Copy, Edit, Trash2, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { useDeleteCausse } from "./deleteCausseHook";
import { UpdateCausse } from "./updateCausse";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => toast.success("Copié dans le presse-papiers"))
    .catch(() => toast.error("Échec de la copie"));
};

export const Caussecolumns = [
  {
    accessorKey: "code_causse",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Code Causse
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium whitespace-nowrap">
        {row.getValue("code_causse")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "causse",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Causse
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("causse")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const causse = row.original;
      const { mutate: deleteCausse, isPending: isDeleting } = useDeleteCausse();
      
      const handleDelete = async () => {
        try {
          await deleteCausse(causse.code_causse);
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
              onClick={() => handleCopy(causse.code_causse)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier le code
            </DropdownMenuItem>
            
            <UpdateSheet 
              id={causse.code_causse} 
              Component={UpdateCausse} 
              text="Modifier la causse"
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
                    Êtes-vous sûr de vouloir supprimer la causse {causse.code_causse} ? 
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