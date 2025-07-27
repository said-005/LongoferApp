"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MachineApi } from "../../Api/machineApi";
import SheetCloseComponent from "../SheetClose";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  codeMachine: z.string().min(2, {
    message: "Le code machine doit contenir au moins 2 caractères",
  }),
  MachineName: z.string().min(2, {
    message: "Le nom de la machine doit contenir au moins 2 caractères",
  }),
});

export function UpdateMachine({ id }) {
  const queryClient = useQueryClient();

  // Fetch machine data
  const { data: machineData, isLoading, isError, error } = useQuery({
    queryKey: ['machine', id],
    queryFn: () => MachineApi.getMachineById(id),
    onError: (err) => {
      toast.error("Échec du chargement des données", {
        description: err.response?.data?.message || err.message,
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
    enabled: !!id,
  });

  // Mutation for updating data
  const { mutate: updateMachine, isPending } = useMutation({
    mutationFn: (values) => MachineApi.updateMachine(id, values),
    onSuccess: () => {
      toast.success("Machine mise à jour", {
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ['machine', id] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour", {
        description: error.response?.data?.message || error.message,
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
  });

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeMachine: "",
      MachineName: "",
    },
  });

  // Update form defaults when data is loaded
  useEffect(() => {
    if (machineData) {
      form.reset({
        codeMachine: machineData.data.codeMachine || "",
        MachineName: machineData.data.MachineName || "",
      });
    }
  }, [machineData, form]);

  const onSubmit = (values) => {
    updateMachine(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(
        "bg-destructive/10 border border-destructive text-destructive",
        "dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
        "p-4 rounded-lg"
      )}>
        <p>Échec du chargement des données</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Une erreur inconnue est survenue'}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
        "space-y-6 w-full max-w-md p-6 rounded-lg",
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-800",
        "shadow-md dark:shadow-gray-950/50"
      )}>
        <h2 className={cn(
          "text-xl font-bold text-center",
          "text-gray-800 dark:text-gray-100"
        )}>
          Modifier la Machine
        </h2>

        <FormField
          control={form.control}
          name="codeMachine"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-gray-700 dark:text-gray-300"
              )}>
                Code Machine*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Entrez le code machine" 
                  {...field} 
                  disabled={isPending}
                  className={cn(
                    "dark:bg-gray-800 dark:border-gray-700",
                    "dark:text-white dark:placeholder-gray-400",
                    "focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="MachineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-gray-700 dark:text-gray-300"
              )}>
                Nom de la Machine*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Entrez le nom de la machine" 
                  {...field} 
                  disabled={isPending}
                  className={cn(
                    "dark:bg-gray-800 dark:border-gray-700",
                    "dark:text-white dark:placeholder-gray-400",
                    "focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
            </FormItem>
          )}
        />
        
        <div className="flex flex-col gap-2 pt-2">
          <Button 
            type="submit" 
            className={cn(
              "w-full",
              "bg-blue-600 hover:bg-blue-700",
              "dark:bg-blue-700 dark:hover:bg-blue-800",
              "text-white dark:text-gray-100"
            )}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : "Mettre à jour"}
          </Button>
          
          <SheetCloseComponent className={cn(
            "w-full",
            "border-gray-300 hover:bg-gray-100",
            "dark:border-gray-700 dark:hover:bg-gray-800",
            "text-gray-800 dark:text-gray-200"
          )} />
        </div>
      </form>
    </Form>
  );
}