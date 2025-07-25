import { MoreHorizontal, Loader2, Plus, Copy, Edit, Trash2 } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog"
import { toast } from "sonner";
import { UpdateClient } from "./UpdateClient";
import { useDeleteClient } from "./delteClientHook";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success("Copied to clipboard");
    })
    .catch((err) => {
      console.error('Failed to copy:', err);
      toast.error("Failed to copy to clipboard");
    });
};

export const ClientColumns = [
  {
    accessorKey: "codeClient",
    header: "Client Code",
    cell: ({ row }) => (
      <div className="font-medium uppercase">
        {row.getValue("codeClient")}
      </div>
    ),
  },
  {
    accessorKey: "Client",
    header: "Client Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("Client")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 line-clamp-1">
        {row.getValue("address") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "tele",
    header: "Phone",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("tele") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email");
      return email ? (
        <a 
          href={`mailto:${email}`} 
          className="text-sm text-blue-600 hover:underline"
        >
          {email}
        </a>
      ) : (
        <span className="text-sm text-gray-400">N/A</span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const client = row.original;
      const { mutate:deleteClient, isPending } = useDeleteClient();
      const handleDelete = () => {
         deleteClient(client.codeClient)
         

      };

      return (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100"
                aria-label="Open client actions menu"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Client Actions</DropdownMenuLabel>
              
              <DropdownMenuItem
                onClick={() => handleCopy(client.codeClient)}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Client Code
              </DropdownMenuItem>
              
         <Sheet>
  <SheetTrigger asChild>
    <DropdownMenuItem 
      onSelect={(e) => e.preventDefault()}
      className="cursor-pointer"
    >
      <Edit className="mr-2 h-4 w-4" />
      Edit Client
    </DropdownMenuItem>
  </SheetTrigger>
  <SheetContent 
    className="overflow-y-auto w-full sm:max-w-md lg:max-w-lg xl:max-w-xl"
    onInteractOutside={(e) => {
      // Prevent closing when clicking on toast notifications
      if (e.target?.closest('.toast')) {
        e.preventDefault();
      }
    }}
  >
    <div className="h-full flex flex-col">
      <SheetHeader className="mb-4">
        <SheetTitle>Edit Client</SheetTitle>
        <SheetDescription>
          Update client information below
        </SheetDescription>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto">
        <UpdateClient 
         key={client.codeClient}
          codeClient={client.codeClient} 
          onSuccess={() => {
            toast.success("Client updated successfully");
            // The sheet will close automatically after successful update
          }}
          onCancel={() => {
          }}
        />
      </div>
    </div>
  </SheetContent>
</Sheet>

              <DropdownMenuSeparator />
              
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Client
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete <strong>{client.Client}</strong>? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                   <Button
  variant="destructive"
  disabled={isPending}
  onClick={handleDelete} // Just pass the function reference
>
  {isPending ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Deleting...
    </>
  ) : (
    "Delete"
  )}
</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  }
];