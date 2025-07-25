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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { StatutApi } from "../../Api/StatutApi";
import { useNavigate } from "react-router-dom";

// Schema with TypeScript type
const formSchema = z.object({
  status: z.string({
    required_error: "Le statut est requis",
  })
  .min(1, "Le statut ne peut pas être vide")
  .max(50, "Le statut doit contenir moins de 50 caractères"),
});

export function StatutForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
    },
  });

  // Create status mutation
  const { mutate: createStatut, isPending } = useMutation({
    mutationFn: (values) => StatutApi.createStatut(values),
    onSuccess: () => {
      toast.success("Statut créé", {
        description: "Le nouveau statut a été enregistré avec succès",
      });
      queryClient.invalidateQueries(['statuts']);
      form.reset();
    },
    onError: (error) => {
      toast.error("Échec de la création", {
        description: error.response.data.message || "Une erreur est survenue lors de la création",
      });
    }
  });

  const onSubmit = (values) => {
    createStatut({
      Statut: values.status
    });
  };

  const handleAnnuler = () => {
    navigate('/statut');
  };

  return (
    <Form {...form}>
      <div className="flex justify-center items-start pt-10 min-h-[200px] rounded-lg p-4 mt-20">
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6 w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold text-center">Ajouter un Statut</h2>
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Statut*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Saisissez le statut..." 
                    {...field} 
                    className="focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : "Enregistrer"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full"
              onClick={handleAnnuler}
              disabled={isPending}
            >
              Annuler
            </Button>
          </div>
        </form>      
      </div>
    </Form>
  );
}