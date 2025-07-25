
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
export default function TextareaWithLabel({message}) {
  return (
    <div className="grid w-full gap-3">
      <Label htmlFor="message">{message}</Label>
      <Textarea placeholder={message} id="message" />
    </div>
  )
}