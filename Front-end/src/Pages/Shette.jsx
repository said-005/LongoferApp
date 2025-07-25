import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";

export function UpdateSheet({ Component, id, text = "Modifier", iconSize = 4, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 p-1 hover:bg-gray-100 ${className}`}
          onClick={() => setIsOpen(true)}
        >
          <Edit className={`h-${iconSize} w-${iconSize}`} />
          <span className="text-sm">Editer</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>{text}</SheetTitle>
          <SheetDescription>
            Modifier les informations de cet élément
          </SheetDescription>
        </SheetHeader>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {isLoading ? (
            <div className="h-full flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Component 
              id={id} 
              onSuccess={() => setIsOpen(false)}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}