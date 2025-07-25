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
import { toast } from 'sonner'
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { MatiereApi } from "../../Api/matiereApi";
import { useNavigate } from "react-router-dom";

// Constants
const FORM_SCHEMA = z.object({
  code_matiere: z.string()
    .min(2, { message: "Le code matière doit contenir au moins 2 caractères" })
    .max(20, { message: "Le code matière ne peut pas dépasser 20 caractères" }),
  matiere: z.string()
    .min(2, { message: "Le nom de la matière doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom de la matière ne peut pas dépasser 50 caractères" }),
});



export function MatiereForm() {
    const navigate=useNavigate()
  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      code_matiere: "",
      matiere: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const mutation = useMutation({
    mutationFn: MatiereApi.createMatiere,
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La matière a été enregistrée avec succès",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
  };
  const handleCancel=()=>{
navigate('/matiere')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-30 w-1/2  mx-auto shadow-2xl p-4 rounded-2xl">
      <h1 className="text-2xl font-bold text-center">Matiere Form </h1>
      <hr />

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
                  className="uppercase" // Auto-uppercase for codes
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
              <FormLabel>Matière *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex:" 
                  {...field} 
                  disabled={mutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
            <Button variant={'outline'} type='button' onClick={handleCancel} className="mr-2">
                Annuler
            </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending || !form.formState.isDirty}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}