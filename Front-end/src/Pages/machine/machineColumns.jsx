import { toast } from "sonner";
import { MoreHorizontal, Copy, Edit, Trash2,ArrowUpDown ,ArrowUp ,ArrowDown  } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useDeleteMachine } from './deleteMachineHokk';
import { UpdateMachine } from "./updateMachine";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => toast.success("Copié dans le presse-papiers"))
    .catch(() => toast.error("Échec de la copie"));
};

export const Machinecolumns = [
  {
    accessorKey: "codeMachine",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Code Machine
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
      <div className="font-medium whitespace-nowrap">
        {row.getValue("codeMachine")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "MachineName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Nom de la machine
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
      <div className="whitespace-nowrap">
        {row.getValue("MachineName")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const machine = row.original;
      const { mutate: deleteMachine, isDeleting } = useDeleteMachine();

      const handleDelete = async () => {
        try {
          await deleteMachine(machine.codeMachine);
          toast.success("Machine supprimée avec succès");
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
              className="h-8 w-8 p-0 hover:bg-gray-200"
              aria-label="Menu des actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            <DropdownMenuItem
              onClick={() => handleCopy(machine.codeMachine)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier le code
            </DropdownMenuItem>
            
            <UpdateSheet 
              id={machine.codeMachine} 
              Component={UpdateMachine} 
              text="Modifier la machine"
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
                    Êtes-vous sûr de vouloir supprimer la machine {machine.codeMachine} ? 
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
