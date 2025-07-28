import { UpdateSheet } from "../Shette";
import { UpdateTubeHS } from "./UpdateTube_HS_chute";
import { MoreHorizontal, Trash } from "lucide-react";
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
import { useState } from "react";

import { useDeleteTubeHS } from "./deltetUBE_hsHook";

export const TubeSHcolumns = [
  {
    accessorKey: "ref_production",
    header: "production reference",
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("ref_production")}
      </div>
    ),
  },
  {
    accessorKey: "OF",
    header: "N° OF",
    cell: ({ row }) => (
      <div className="font-mono uppercase">
        {row.getValue("OF")}
      </div>
    ),
  },
  {
    accessorKey: "Article",
    header: "Ref Article",
  },
  {
    accessorKey: "Date",
    header: "Date",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("Date")}
      </div>
    ),
  },
  {
    accessorKey: "Qte_Chute_HS",
    header: "Quantité Chute HS",
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const tube = row.original;
 
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
      const { mutate:deleteTubeHS, isDeleting } = useDeleteTubeHS();

      const handleDelete = async () => {
          await deleteTubeHS(tube.id);
         setOpenDeleteDialog(false)
   
      };

      return (
        <>
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
              <DropdownMenuItem asChild>
                <UpdateSheet Component={UpdateTubeHS} id={tube.id} text="update the Tube HS below"/>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Trash/>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le tube HS.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  }
];