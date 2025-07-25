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

// Schema validation with TypeScript types
const formSchema = z.object({
  fullName: z.string()
    .min(1, "Le nom complet est requis")
    .max(100, "Maximum 100 caractères").trim(),
  position: z.string()
    .min(1, "La fonction est requise")
    .max(50, "Maximum 50 caractères").trim(),
  machine: z.string()
    .min(1, "La machine est requise"),
  code_operateur: z.string()
    .min(2, "Le code est requis").trim(),
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
      });
    },
  });

  // Prepare machines data for AutocompleteInput
  const machinesOptions = machinesData?.data?.data?.map((machine) => ({
    label: machine.MachineName, // Adjust according to your machine object structure
    value: machine.codeMachine,   // Adjust according to your machine object structure
  })) || [];

  // Mutation for creating a new operator
  const { mutate: createOperateur, isPending } = useMutation({
    mutationFn: async (values) => {      
      await OperateurApi.createOperateur(values);
    },
    onSuccess: () => {
      toast.success('Opérateur créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['operateurs'] });
     
    },
    onError: (error) => {
      toast.error('Erreur lors de la création', {
        description: error.response?.data?.message || 'Une erreur est survenue',
      });
    }
  });


  const onSubmit = (values) => {
    console.log(values)
    
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
    <div className="flex justify-center p-4 mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
          
          <h1 className="text-2xl font-bold">Ajouter un opérateur</h1>
          
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
                    autoComplete="off"
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
                    autoComplete="name"
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
                    autoComplete="organization-title"
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

          <div className="flex flex-col space-y-2 pt-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
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
              className="w-full"
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