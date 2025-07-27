"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  codeMachine: z.string().min(2, {
    message: "Le code machine doit contenir au moins 2 caractères",
  }),
  MachineName: z.string().min(2, {
    message: "Le nom de la machine doit contenir au moins 2 caractères",
  }),
});

export function MachineForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeMachine: "",
      MachineName: "",
    },
  });

  const { mutate: createMachine, isPending } = useMutation({
    mutationFn: MachineApi.createMachine,
    onSuccess: () => {
      toast.success("Machine créée avec succès", {
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      form.reset();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création", {
        description: error.message || "Une erreur est survenue",
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
  });

  const onSubmit = (values) => {
    createMachine(values);
  };

  const handleAnnuler = () => {
    navigate('/machine');
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className={cn(
            "space-y-6 w-full max-w-md p-6 rounded-lg",
            "bg-white dark:bg-gray-900",
            "border border-gray-200 dark:border-gray-800",
            "shadow-lg dark:shadow-gray-950/50"
          )}
        >
          <h1 className={cn(
            "text-2xl font-bold text-center",
            "text-gray-800 dark:text-gray-100"
          )}>
            Ajouter une Machine
          </h1>

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
                  Création...
                </>
              ) : "Créer la Machine"}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleAnnuler}
              className={cn(
                "w-full",
                "border-gray-300 hover:bg-gray-100",
                "dark:border-gray-700 dark:hover:bg-gray-800",
                "text-gray-800 dark:text-gray-200"
              )}
              disabled={isPending}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}