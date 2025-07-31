import { MoreHorizontal, Trash2, ArrowUpDown } from "lucide-react";
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
import { toast } from "sonner";

import { useDeletePeinture_ext } from "./deletePeintureINTHook";
import { UpdateSheet } from "../../Shette";
import UpdatePeintureInt from "./updatePeintureINT";

export const PeintureINTColumns = [
  {
    accessorKey: "code_Peinture_internes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Référence Peinture interne
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium uppercase text-xs sm:text-sm">
        {row.getValue("code_Peinture_internes") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "date_Peinture_Interne",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date_Peinture_Interne");
      return (
        <div className="whitespace-nowrap text-xs sm:text-sm">
          {date ? new Date(date).toLocaleDateString() : "-"}
        </div>
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "ref_production",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Référence
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono uppercase text-xs sm:text-sm">
        {row.getValue("ref_production") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "machine",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Machine
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm">
        {row.getValue("machine") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Statut
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm">
        {row.getValue("statut") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "defaut",
    header: "Défaut",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden md:block">
        {row.getValue("defaut") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "causse",
    header: "Cause",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden lg:block">
        {row.getValue("causse") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "soudeur",
    header: "Soudeur",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden xl:block">
        {row.getValue("soudeur") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "operateur",
    header: "Opérateur",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden 2xl:block">
        {row.getValue("operateur") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "controleur",
    header: "Contrôleur",
    cell: ({ row }) => (
      <div className="capitalize text-xs sm:text-sm hidden 2xl:block">
        {row.getValue("controleur") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-mono uppercase text-xs sm:text-sm">
        {row.getValue("description") || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "Actions",
    header: "",
    cell: ({ row }) => {
      const peinture_int = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const { mutate, isPending: isDeleting } = useDeletePeinture_ext();

      const handleDelete = () => {
        mutate(peinture_int.code_Peinture_internes, {
          onSuccess: () => {
            setDeleteDialogOpen(false);
          },
         
        });
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-gray-100 sm:h-8 sm:w-8"
                aria-label="Ouvrir le menu des actions"
                disabled={isDeleting}
              >
                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel className="text-xs sm:text-sm">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem asChild className="text-xs sm:text-sm">
                <UpdateSheet
                  Component={UpdatePeintureInt}
                  id={peinture_int.code_Peinture_internes}
                  text="Modifier les informations"
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer text-xs sm:text-sm"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent className="max-w-[95%] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-sm sm:text-base">
                  Êtes-vous sûr ?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm">
                  Cette action supprimera définitivement cet enregistrement de
                  réparation et ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeleting}
                  className="text-xs sm:text-sm"
                >
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-xs sm:text-sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Suppression...
                    </span>
                  ) : (
                    "Confirmer"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];