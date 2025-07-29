import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdateSheet } from "../Shette";
import { UpdateConsommation } from "./updateConsommation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteConsommation } from "./deleteConsommationHook";
import { Input } from "@/components/ui/input";

export const ConsommationColumns = [
  {
    accessorKey: "ArticleMatiere",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Article Matière
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium capitalize">
        {row.getValue("ArticleMatiere")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "Date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent whitespace-nowrap"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {new Date(row.getValue("Date")).toLocaleDateString()}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      return new Date(rowA.getValue(columnId)) - new Date(rowB.getValue(columnId));
    },
  },
  {
    accessorKey: "OF",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        OF
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("OF")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "ArticleOF",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Article OF
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("ArticleOF")}
      </div>
    ),
  },
  {
    accessorKey: "Num_LotOF",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        N° Lot
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono">
        {row.getValue("Num_LotOF")}
      </div>
    ),
  },
  {
    accessorKey: "Qte_Conso",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Qté Consommée
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {parseFloat(row.getValue("Qte_Conso")).toFixed(2)}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      return parseFloat(rowA.getValue(columnId)) - parseFloat(rowB.getValue(columnId));
    },
  },
  {
    accessorKey: "Qte_Chute",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Qté Chute
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {parseFloat(row.getValue("Qte_Chute")).toFixed(2)}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      return parseFloat(rowA.getValue(columnId)) - parseFloat(rowB.getValue(columnId));
    },
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const consommation = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate: deleteConsommation, isPending: isDeleting } = useDeleteConsommation();

      const handleDelete = () => {
        deleteConsommation(consommation.id, {
          onSuccess: () => {
            toast.success("Consommation supprimée avec succès");
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            toast.error("Échec de la suppression", {
              description: error.message,
            });
          }
        });
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100"
                aria-label="Actions menu"
                disabled={isDeleting}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <UpdateSheet 
                  Component={UpdateConsommation} 
                  text="Modifier consommation" 
                  id={consommation.id} 
                  data={consommation}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement la consommation du {new Date(consommation.Date).toLocaleDateString()} (OF: {consommation.OF}).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Suppression...</span>
                    </span>
                  ) : "Confirmer la suppression"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
    
  }
];