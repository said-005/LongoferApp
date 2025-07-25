import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { MachineApi } from "../../Api/machineApi"
import SheetCloseComponent from "../SheetClose"
import { useNavigate } from "react-router-dom"

// Define the form schema using Zod
const formSchema = z.object({
  codeMachine: z.string({message:''}).min(2, {
    message: "Machine code must be at least 2 characters.",
  }),
  MachineName: z.string().min(2, {
    message: "Machine name must be at least 2 characters.",
  }),
})

// Type for our form values

export function MachineForm() {
    const navigate=useNavigate()
  const queryClient = useQueryClient()

  // Initialize the form with proper typing
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeMachine: "",
      MachineName: "",
    },
  })

  // Mutation for creating machine
  const { mutate: createMachine, isPending } = useMutation({
    mutationFn: MachineApi.createMachine,
    onSuccess: () => {
      toast.success("Machine created successfully")
      queryClient.invalidateQueries({ queryKey: ["machines"] })
      form.reset({
              codeMachine: "",
      MachineName: "",
      }) // Reset form after successful submission
    },
    onError: (error) => {
      toast.error("Error creating machine", {
        description: error.message,
      })
    },
  })

  // Handle form submission
  const onSubmit = (values) => {
    createMachine(values)
  }
  const handelAnnuler=()=>{
 navigate('/machine')
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8 mt-25 w-full max-w-md mx-auto shadow-2xl p-3 rounded "
      >

        <h1 className="text-2xl text-center font-bold">machine Form </h1>
        <FormField
          control={form.control}
          name="codeMachine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machine Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter machine code" 
                  {...field} 
                  disabled={isPending}
                />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="MachineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machine Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter machine name" 
                  {...field} 
                  disabled={isPending}
                />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Creating..." : "Create Machine"}
        </Button>
        <Button variant={'outline'} className="w-full -mt-4" onClick={handelAnnuler} type='button'>
            Annuler
        </Button>
      </form>
    </Form>
  )
}