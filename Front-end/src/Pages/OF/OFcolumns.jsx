import { MoreHorizontal, Trash2, ArrowUpDown, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
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

const OFcolumns = [
  {
    accessorKey: "codeOf",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent px-0"
      >
        N° OF
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-bold uppercase text-foreground">
        {row.getValue("codeOf")}
      </div>
    ),
    filterFn: "includesString",
    sortingFn: "text",
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent px-0"
      >
        Client
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.getValue("client")}
      </div>
    ),
    filterFn: "includesString",
    sortingFn: "text",
  },
  {
    accessorKey: "Date_OF",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent px-0"
      >
        Date OF
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDateCell(row.getValue("Date_OF")),
    sortingFn: "datetime",
  },
  {
    accessorKey: "date_Prevue_Livraison",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent px-0"
      >
        Livraison Prévue
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDateCell(row.getValue("date_Prevue_Livraison")),
    sortingFn: "datetime",
  },
  {
    accessorKey: "Article_1",
    header: "Article 1",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_1")),
    filterFn: "includesString",
    enableSorting: false,
  },
  {
    accessorKey: "Article_2",
    header: "Article 2",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_2")),
    filterFn: "includesString",
    enableSorting: false,
  },
  {
    accessorKey: "Article_3",
    header: "Article 3",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_3")),
    filterFn: "includesString",
    enableSorting: false,
  },
  {
    accessorKey: "Article_4",
    header: "Article 4",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_4")),
    filterFn: "includesString",
    enableSorting: false,
  },
  {
    accessorKey: "Article_5",
    header: "Article 5",
    cell: ({ row }) => renderArticleCell(row.getValue("Article_5")),
    filterFn: "includesString",
    enableSorting: false,
  },
  {
    accessorKey: "Revetement_Ext",
    header: "Revêtement Ext",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Revetement_Ext")),
    filterFn: "equals",
    enableSorting: false,
  },
  {
    accessorKey: "Sablage_Ext",
    header: "Sablage Ext",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Sablage_Ext")),
    filterFn: "equals",
    enableSorting: false,
  },
  {
    accessorKey: "Sablage_Int",
    header: "Sablage Int",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Sablage_Int")),
    filterFn: "equals",
    enableSorting: false,
  },
  {
    accessorKey: "Revetement_Int",
    header: "Revêtement Int",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Revetement_Int")),
    filterFn: "equals",
    enableSorting: false,
  },
  {
    accessorKey: "Manchette_ISO",
    header: "Manchette ISO",
    cell: ({ row }) => renderBooleanBadge(row.getValue("Manchette_ISO")),
    filterFn: "equals",
    enableSorting: false,
  },
  {
    accessorKey: 'actions',
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
    enableSorting: false,
    enableHiding: false,
  }
];

export function ColumnVisibility({ table }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <EyeOff className="mr-2 h-4 w-4" />
          Colonnes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OFcolumns;