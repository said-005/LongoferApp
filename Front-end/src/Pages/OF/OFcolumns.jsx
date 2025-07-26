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
import { Badge } from "@/components/ui/badge";
import { UpdateOf } from "./updateOf";
import { UpdateSheet } from "../Shette";
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
import { useDeleteOf } from "./deleteOfHook";

const renderBooleanBadge = (value) => (
  <Badge 
    variant={value === 1 ? 'default' : 'outline'}
    className={value === 1 
      ? 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800' 
      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
    }
  >
    {value === 1 ? 'Oui' : 'Non'}
  </Badge>
);

const renderArticleCell = (value) => (
  <div className="font-medium text-foreground">
    {value ? value : '-'}
  </div>
);

const renderDateCell = (dateString) => (
  <div className="whitespace-nowrap text-foreground">
    {dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '-'}
  </div>
);

export const OFcolumns = [
  {
    accessorKey: "codeOf",
    header: "N° OF",
    cell: ({ row }) => (
      <div className="font-bold uppercase text-foreground">
        {row.getValue("codeOf")}
      </div>
    ),
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.getValue("client")}
      </div>
    ),
  },
  {
    accessorKey: "Date_OF",
    header: "Date OF",
    cell: ({ row }) => renderDateCell(row.getValue("Date_OF")),
  },
  {
    accessorKey: "date_Prevue_Livraison",
    header: "Livraison Prévue",
    cell: ({ row }) => renderDateCell(row.getValue("date_Prevue_Livraison")),
  },
  {
    accessorKey: "Article_1",
    header: "Article 1",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_1")),
  },
  {
    accessorKey: "Article_2",
    header: "Article 2",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_2")),
  },
  {
    accessorKey: "Article_3",
    header: "Article 3",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_3")),
  },
  {
    accessorKey: "Article_4",
    header: "Article 4",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_4")),
  },
  {
    accessorKey: "Article_5",
    header: "Article 5",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_5")),
  },
  {
    accessorKey: "Revetement_Ext",
    header: "Revêtement Ext",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Revetement_Ext")),
  },
  {
    accessorKey: "Sablage_Ext",
    header: "Sablage Ext",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Sablage_Ext")),
  },
  {
    accessorKey: "Sablage_Int",
    header: "Sablage Int",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Sablage_Int")),
  },
  {
    accessorKey: "Revetement_Int",
    header: "Revêtement Int",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Revetement_Int")),
  },
  {
    accessorKey: "Manchette_ISO",
    header: "Manchette ISO",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Manchette_ISO")),
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const of = row.original;
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
      const { mutate: deleteOf, isPending: isDeleting } = useDeleteOf();

      const handleDelete = () => {
        deleteOf(of.codeOf);
        setOpenDeleteDialog(false);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-muted"
                aria-label="Menu des actions"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <UpdateSheet Component={UpdateOf} id={of.codeOf} text="Modifier OF" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer l'OF {of.codeOf} ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDelete}
                  disabled={isDeleting}
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