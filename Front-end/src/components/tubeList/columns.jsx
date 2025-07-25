import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns = [
  {
    accessorKey: "NumOF",
    header: "Nombre de OF",
  },
  {
    accessorKey: "Article",
    header: "Article",
  },
  {
    accessorKey: "RefArticle",
    header: "Ref Article",
  },
    {
    accessorKey: "DateProduction",
    header: "date",
  },
  {
    accessorKey: "QteProduite",
    header: "Qte Produite",
  },
  {
    accessorKey: "Machine",
    header: "Machine",
  },
  {
    accessorKey: "Statut",
    header: "Statut",
  },
  {
    accessorKey: "Défaut",
    header: "Défaut",
  },
  {
    accessorKey: "Causse",
    header: "Causse",
  },
  {
    accessorKey: "Operateur",
    header: "Opérateur",
  },
  {
    accessorKey: "Soudeur",
    header: "Soudeur",
  },
  {
    accessorKey: "Controleur",
    header: "Controleur",
    
  },
  {
    accessorKey:'Actions',
    header:'Actions',
     cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
                update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>delete</DropdownMenuItem>
      
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]