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

// Schema validation
const formSchema = z.object({
  fullName: z.string()
    .min(1, "Le nom complet est requis")
    .max(100, "Maximum 100 caractères"),
  position: z.string()
    .min(1, "La fonction est requise")
    .max(50, "Maximum 50 caractères"),
  machine: z.string()
    .min(1, "La machine est requise")
    .max(50, "Maximum 50 caractères"),
  code_operateur: z.string()
    .min(1, "Le code est requis"),
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
      });
    },
    enabled: !!id, // Only fetch when id is available
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      position: "",
      machine: "",
      code_operateur: "",
    },
  });
  
    // Get machines data
    const { data: machinesData, isLoading: isMachinesLoading } = useQuery({
      queryKey: ['machines'],
      queryFn: MachineApi.getAll,
      onError: (error) => {
        toast.error("Échec du chargement des machines", {
          description: error.message,
        });
      },
    });
  
    // Prepare machines data for AutocompleteInput
    const machinesOptions = machinesData?.data?.data?.map((machine) => ({
      label: machine.MachineName, // Adjust according to your machine object structure
      value: machine.codeMachine,   // Adjust according to your machine object structure
    })) || [];
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
      });
      queryClient.invalidateQueries(['operateurs']);
      queryClient.invalidateQueries(['operateur', id]);
    },
    onError: (error) => {
      toast.error("Échec de la mise à jour", {
        description: error.message || "Une erreur est survenue lors de la mise à jour",
      });
    }
  });

  function onSubmit(values) {
    updateOperateur({
      operateur:values.code_operateur,
      Fonction:values.position,
      Machine:values.machine,
      nom_complete:values.fullName
    });
    console.log({
      operateur:values.code_operateur,
      Fonction:values.position,
      Machine:values.machine,
      nom_complete:values.fullName
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-red-500">
        Erreur de chargement des données
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
        {/* Code Opérateur */}
        <FormField
          control={form.control}
          name="code_operateur"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Code Opérateur*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="op-0001" 
                  {...field} 
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Nom Complet */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Nom Complet*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Jean Dupont" 
                  {...field} 
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Fonction */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Fonction*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Opérateur CNC" 
                  {...field} 
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Machine */}
        <FormField
          control={form.control}
          name="machine"
          render={({ field }) => (
            <FormItem>
              
              <FormLabel className="font-medium">Machine*</FormLabel>
              <FormControl>
              <AutocompleteInput
                    data={machinesOptions}
                    text="Sélectionnez une machine"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value); // This will update the form value with the machine ID
                    }}
                    required={true}
                    disabled={isPending || isMachinesLoading}
                    />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
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
              className="w-full" 
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