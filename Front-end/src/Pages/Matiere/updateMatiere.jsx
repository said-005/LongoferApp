"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { MatiereApi } from "../../Api/matiereApi";
import { useEffect } from "react";
import SheetCloseComponent from "../SheetClose";


// Constants
const FORM_SCHEMA = z.object({
  code_matiere: z.string()
    .min(2, { message: "Le code matière doit contenir au moins 2 caractères" })
    .max(20, { message: "Le code matière ne peut pas dépasser 20 caractères" }),
  matiere: z.string()
    .min(2, { message: "Le nom de la matière doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom de la matière ne peut pas dépasser 50 caractères" }),
});

export function UpdateMatiere({ id }) {

  const queryClient = useQueryClient();

  // Fetch existing matiere data
  const { data: matiereData, isLoading: isFetching, isError } = useQuery({
    queryKey: ['matiere', id],
    queryFn: () => MatiereApi.getMatiereById(id),
    enabled: !!id, // Only fetch if id exists
    onError: (error) => {
      toast.error("Échec du chargement de la matière", {
        description: error.message,
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      code_matiere: "",
      matiere: "",
    },
    mode: "onBlur",
  });

  // Set form values when data is loaded
  useEffect(() => {
    if (matiereData?.data) {
      form.reset({
        code_matiere: matiereData.data.code_matiere,
        matiere: matiereData.data.matiere,
      });
    }
  }, [matiereData, form]);

  const mutation = useMutation({
    mutationFn: (values) => MatiereApi.updateMatiere(id, values),
    onSuccess: () => {
      toast.success("Matière mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['matieres'] });
      queryClient.invalidateQueries({ queryKey: ['matiere', id] });
    
    },
    onError: (error) => {
      toast.error("Échec de la mise à jour", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/15 border border-destructive text-destructive p-4 rounded-lg">
        <p>Impossible de charger les données de la matière</p>
        <Button 
          variant="outline" 
          className="mt-2"
        
        >
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Modifier la matière</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code_matiere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Matière *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: MATH101" 
                    {...field} 
                    autoComplete="off"
                    disabled={mutation.isPending}
                    className="uppercase"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="matiere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la matière *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Mathématiques" 
                    {...field} 
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end items-center gap-4 pt-4">
            <div className="w-1/3">
             <SheetCloseComponent/>    
            </div>
        
            <Button 
              type="submit" 
              disabled={mutation.isPending || !form.formState.isDirty}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}