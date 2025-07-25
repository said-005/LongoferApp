
import { SheetClose } from '@/components/ui/sheet';
import {Button} from "@/components/ui/button"

  export default function SheetCloseComponent()
  {
    return (<>
    <SheetClose asChild>
              <Button  className="w-full mt-1" variant="outline">Close</Button>
            </SheetClose>
    </>)
  }