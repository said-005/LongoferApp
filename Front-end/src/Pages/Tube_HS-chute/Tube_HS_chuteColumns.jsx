import { ArrowUp, ArrowDown, ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
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
import { UpdateTubeHS } from "./UpdateTube_HS_chute";
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
import { useState } from "react";
import { useDeleteTubeHS } from "./deltetUBE_hsHook";
import { toast } from "sonner";
import { format } from "date-fns";

export const TubeSHcolumns = [
  {
    accessorKey: "ref_production",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Référence Production
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
      <div className="font-mono uppercase">
        {row.getValue("ref_production")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
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
        N° OF
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
      <div className="font-mono uppercase">
        {row.getValue("OF")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "Article",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Référence Article
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
        {row.getValue("Article")}
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
        className="px-0 hover:bg-transparent"
      >
        Date
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("Date");
      const formattedDate = dateValue ? format(new Date(dateValue), "dd/MM/yyyy HH:mm") : "N/A";
      return <div className="whitespace-nowrap">{formattedDate}</div>;
    },
    filterFn: (row, id, value) => {
      const dateValue = row.getValue(id);
      if (!dateValue) return false;
      return format(new Date(dateValue), "dd/MM/yyyy").includes(value);
    },
  },
  {
    accessorKey: "Qte_Chute_HS",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 hover:bg-transparent"
      >
        Quantité Chute HS
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
      <div className="text-right font-medium">
        {Number(row.getValue("Qte_Chute_HS")).toLocaleString()}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).includes(value);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const tube = row.original;
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
      const { mutate: deleteTubeHS, isPending } = useDeleteTubeHS();

      const handleDelete = async () => {
        toast.promise(
          () => new Promise((resolve, reject) => {
            deleteTubeHS(tube.id, {
              onSuccess: () => {
                resolve();
                setOpenDeleteDialog(false);
              },
              onError: reject
            });
          }),
          {
            loading: "Suppression en cours...",
            success: "Tube HS supprimé avec succès",
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
              <DropdownMenuItem asChild>
                <UpdateSheet 
                  Component={UpdateTubeHS} 
                  id={tube.id} 
                  text="Modifier le tube HS"
                  className="w-full"
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Vous êtes sur le point de supprimer définitivement ce tube HS :
                  <div className="mt-2 space-y-1 font-medium">
                    <p>• Référence: {tube.ref_production}</p>
                    <p>• OF: {tube.OF}</p>
                    <p>• Quantité: {tube.Qte_Chute_HS}</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
                >
                  {isPending ? (
                    <>
                      <Trash className="mr-2 h-4 w-4 animate-pulse" />
                      Suppression...
                    </>
                  ) : "Confirmer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  }
];
