import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
import { AxiosError } from "axios"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

// Define the form schema using Zod
const formSchema = z.object({
  codeMachine: z.string().min(2, {
    message: "Machine code must be at least 2 characters.",
  }),
  MachineName: z.string().min(2, {
    message: "Machine name must be at least 2 characters.",
  }),
})



export function UpdateMachine({ id }) {
    console.log(id)
  const queryClient = useQueryClient()

  // Fetch machine data
  const { data: machineData, isLoading, isError, error } = useQuery({
    queryKey: ['machine', id],
    queryFn: () => MachineApi.getMachineById(id),
    onError: (err) => {
      toast.error("Failed to load machine data", {
        description: err.response?.data?.message || err.message,
      })
    }
  })

  // Mutation for updating data
  const { mutate: updateMachine, isPending } = useMutation({
    mutationFn: (values) => MachineApi.updateMachine(id, values),
    onSuccess: () => {
      toast.success("Machine updated successfully")
      queryClient.invalidateQueries({ queryKey: ["machines"] })
      queryClient.invalidateQueries({ queryKey: ['machine', id] })
    },
    onError: (error) => {
      toast.error("Error updating machine", {
        description: error.response?.data?.message || error.message,
      })
    },
  })

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeMachine: "",
      MachineName: "",
    },
  })

  // Update form defaults when data is loaded
  useEffect(() => {
    if (machineData) {
      form.reset({
        codeMachine: machineData.data.codeMachine || "",
        MachineName: machineData.data.MachineName || "",
      })
    }
  }, [machineData, form])

  const onSubmit = (values) => {
    updateMachine(values)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
        <p>Failed to load machine data</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
        
        <div className="flex flex-col gap-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : "Update Machine"}
          </Button>
          <SheetCloseComponent className="flex-1" />
        </div>
      </form>
    </Form>
  )
}