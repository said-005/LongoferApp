import { MoreHorizontal } from "lucide-react";
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

export const ConsommationColumns = [
  {
    accessorKey: "ArticleMatiere",
    header: "Article Matière",
    cell: ({ row }) => (
      <div className="font-medium capitalize">
        {row.getValue("ArticleMatiere")}
      </div>
    ),
  },
  {
    accessorKey: "Date",
    header: "Date",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {new Date(row.getValue("Date")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "OF",
    header: "OF",
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("OF")}
      </div>
    ),
  },
  {
    accessorKey: "ArticleOF",
    header: "Article OF",
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("ArticleOF")}
      </div>
    ),
  },
  {
    accessorKey: "Num_LotOF",
    header: "N° Lot",
    cell: ({ row }) => (
      <div className="font-mono">
        {row.getValue("Num_LotOF")}
      </div>
    ),
  },
  {
    accessorKey: "Qte_Conso",
    header: "Qté Consommée",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {parseFloat(row.getValue("Qte_Conso")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "Qte_Chute",
    header: "Qté Chute",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {parseFloat(row.getValue("Qte_Chute")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const consommation = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate: deleteConsommation, isLoading: isDeleting } = useDeleteConsommation();

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
                    <>
                      <span className="animate-pulse">Suppression en cours...</span>
                    </>
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