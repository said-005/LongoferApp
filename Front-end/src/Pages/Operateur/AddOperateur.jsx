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
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { OperateurApi } from "../../Api/operateurApi";
import AutocompleteInput from "../../AutoComplet/AutoCompletInput";
import { MachineApi } from "../../Api/machineApi";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string()
    .min(1, "Le nom complet est requis"),
  position: z.string()
    .min(1, "La fonction est requise"),
  machine: z.string()
    .optional()
    .transform(val => val === "" ? undefined : val),
  code_operateur: z.string()
    .min(1, "Le code est requis")
    .trim(),
});

export function OperateurForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      position: "",
      machine: "",
      code_operateur: ""
    },
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

  // Mutation for creating a new operator
  const { mutate: createOperateur, isPending } = useMutation({
    mutationFn: async (values) => {      
      await OperateurApi.createOperateur(values);
    },
    onSuccess: () => {
      toast.success('Opérateur créé avec succès', {
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['operateurs'] });
      navigate('/operateur');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création', {
        description: error.response?.data?.message || 'Une erreur est survenue',
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    }
  });

  const onSubmit = (values) => {
    const data = {
      operateur: values.code_operateur,
      Fonction: values.position,
      nom_complete: values.fullName,
      Machine: values.machine
    };
    createOperateur(data);
  };

  const handleAnnuller = () => {
    navigate('/operateur');
  };

  return (      
    <div className={cn(
      "flex justify-center p-4 mt-10",
      "min-h-[calc(100vh-160px)]"
    )}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
          "space-y-4 w-full max-w-md p-6 rounded-lg",
          "bg-white dark:bg-gray-900",
          "border border-gray-200 dark:border-gray-800",
          "shadow-md dark:shadow-gray-950/50"
        )}>
          
          <h1 className={cn(
            "text-2xl font-bold text-center",
            "text-gray-800 dark:text-gray-100"
          )}>
            Ajouter un opérateur
          </h1>
          
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
                    autoComplete="off"
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
                    autoComplete="name"
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
                    autoComplete="organization-title"
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

          <div className="flex flex-col space-y-2 pt-4">
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
              ) : 'Créer'}
            </Button>
            
            <Button  
              type="button"
              className={cn(
                "w-full",
                "border-gray-300 hover:bg-gray-100",
                "dark:border-gray-700 dark:hover:bg-gray-800",
                "text-gray-800 dark:text-gray-200"
              )}
              variant="outline"
              onClick={handleAnnuller}
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