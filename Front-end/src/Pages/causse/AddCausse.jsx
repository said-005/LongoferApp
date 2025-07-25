import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CausseApi } from "@/api/causseApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the form schema using Zod
const formSchema = z.object({
  code_causse: z.string().min(2, {
    message: "Cause code must be at least 2 characters.",
  }),
  causse: z.string().min(2, {
    message: "Cause description must be at least 2 characters.",
  }),
});



export function CausseForm({ initialData, onSuccess }) {
    const navigate=useNavigate()
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code_causse: "",
      causse: "",
    },
  });

  const { mutate: submitCausse, isPending } = useMutation({
    mutationFn: (values) => {
      return initialData
        ? CausseApi.updateCausse(values)
        : CausseApi.createCausse(values);
    },
    onSuccess: (data) => {
      toast.success(
        initialData ? "Cause updated successfully" : "Cause created successfully",
        {
          description: `Code: ${data.code_causse}`,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["causses"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Error submitting cause", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values) => {
    submitCausse(values);
  };
  const handleCancel=()=>{
navigate('/causse')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-20 w-1/2 shadow-2xl p-3 rounded mx-auto ">
      <h1 className="text-center text-2xl font-bold">Causse Form </h1>
        <FormField
          control={form.control}
          name="code_causse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cause Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cause code"
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
          name="causse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cause Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cause description"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-2">
            <Button variant={'outline'} type='button' onClick={handleCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{initialData ? "Update Cause" : "Create Cause"}</>
            )}
          </Button>
          
        </div>
      </form>
    </Form>
  );
}