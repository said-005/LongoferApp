"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { OperateurApi } from "../../Api/operateurApi";
import { MachineApi } from "../../Api/machineApi";
import AutocompleteInput from "../../AutoComplet/AutoCompletInput";
import { cn } from "@/lib/utils";

// Schema validation
const formSchema = z.object({
  fullName: z.string()
    .min(1, "Le nom complet est requis")
    .max(100, "Maximum 100 caractères")
    .trim(),
  position: z.string()
    .min(1, "La fonction est requise")
    .max(50, "Maximum 50 caractères")
    .trim(),
  machine: z.string()
    .optional(),
  code_operateur: z.string()
    .min(1, "Le code est requis")
    .trim(),
});

export function UpdateOperateur({ id }) {
  const queryClient = useQueryClient();

  // Fetch specific operator data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['operateur', id],
    queryFn: () => OperateurApi.getOperateurById(id),
    onError: (error) => {
      toast.error("Erreur de chargement", {
        description: error.message || "Impossible de charger les données de l'opérateur",
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
    enabled: !!id,
  });

  // Get machines data
  const { data: machinesData, isLoading: isMachinesLoading } = useQuery({
    queryKey: ['machines'],
    queryFn: MachineApi.getAll,
    onError: (error) => {
      toast.error("Échec du chargement des machines", {
        description: error.message,
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
  });

  // Prepare machines data for AutocompleteInput
  const machinesOptions = machinesData?.data?.data?.map((machine) => ({
    label: machine.MachineName,
    value: machine.codeMachine,
  })) || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      position: "",
      machine: "",
      code_operateur: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        fullName: data.data.data.nom_complete,
        position: data.data.data.Fonction,
        machine: data.data.data.Machine,
        code_operateur: data.data.data.operateur,
      });
    }
  }, [data, form]);

  // Update operator mutation
  const { mutate: updateOperateur, isPending } = useMutation({
    mutationFn: (values) => OperateurApi.updateOperateur(id, values),
    onSuccess: () => {
      toast.success("Opérateur mis à jour", {
        description: "Les informations ont été mises à jour avec succès",
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      queryClient.invalidateQueries(['operateurs']);
      queryClient.invalidateQueries(['operateur', id]);
    },
    onError: (error) => {
      toast.error("Échec de la mise à jour", {
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    }
  });

  const onSubmit = (values) => {
    updateOperateur({
      operateur: values.code_operateur,
      Fonction: values.position,
      Machine: values.machine,
      nom_complete: values.fullName
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-red-500 dark:text-red-400">
        Erreur de chargement des données
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
        "space-y-4 w-full max-w-md p-6 rounded-lg",
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-800",
        "shadow-md dark:shadow-gray-950/50"
      )}>
        <h2 className={cn(
          "text-xl font-bold text-center mb-4",
          "text-gray-800 dark:text-gray-100"
        )}>
          Modifier l'opérateur
        </h2>

        {/* Code Opérateur */}
        <FormField
          control={form.control}
          name="code_operateur"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "font-medium",
                "text-gray-700 dark:text-gray-300"
              )}>
                Code Opérateur
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="op-0001" 
                  {...field} 
                  disabled={isPending}
                  className={cn(
                    "dark:bg-gray-800 dark:border-gray-700",
                    "dark:text-white dark:placeholder-gray-400",
                    "focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        {/* Nom Complet */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "font-medium",
                "text-gray-700 dark:text-gray-300"
              )}>
                Nom Complet
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Jean Dupont" 
                  {...field} 
                  disabled={isPending}
                  className={cn(
                    "dark:bg-gray-800 dark:border-gray-700",
                    "dark:text-white dark:placeholder-gray-400",
                    "focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        {/* Fonction */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "font-medium",
                "text-gray-700 dark:text-gray-300"
              )}>
                Fonction
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Opérateur CNC" 
                  {...field} 
                  disabled={isPending}
                  className={cn(
                    "dark:bg-gray-800 dark:border-gray-700",
                    "dark:text-white dark:placeholder-gray-400",
                    "focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        {/* Machine */}
        <FormField
          control={form.control}
          name="machine"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AutocompleteInput
                  data={machinesOptions}
                  text="Sélectionnez une machine"
                  place="Choisissez parmi les suggestions"
                  value={field.value}
                  onChange={field.onChange}
                  required={true}
                  disabled={isPending || isMachinesLoading}
                  className={cn(
                    "dark:bg-gray-800 dark:border-gray-700",
                    "dark:text-white dark:placeholder-gray-400",
                    "focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 dark:text-red-400" />
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
                Enregistrement...
              </>
            ) : "Enregistrer"}
          </Button>
          
          <SheetClose asChild>
            <Button 
              className={cn(
                "w-full",
                "border-gray-300 hover:bg-gray-100",
                "dark:border-gray-700 dark:hover:bg-gray-800",
                "text-gray-800 dark:text-gray-200"
              )}
              variant="outline"
              disabled={isPending}
            >
              Fermer
            </Button>
          </SheetClose>
        </div>
      </form>
    </Form>
  );
}