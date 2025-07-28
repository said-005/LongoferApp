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
import { cn } from "@/lib/utils";

// Schema with TypeScript type
const formSchema = z.object({
  status: z.string({
    required_error: "Le statut est requis",
  })
  .min(1, "Le statut ne peut pas être vide")
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
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      queryClient.invalidateQueries(['statuts']);
      form.reset();
       navigate('/statut');
    },
    onError: (error) => {
      toast.error("Échec de la création", {
        description: error.response.data.message || "Une erreur est survenue lors de la création",
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
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
          className={cn(
            "space-y-6 w-full max-w-md p-6 rounded-lg shadow-md transition-colors",
            "bg-white dark:bg-gray-900",
            "border border-gray-200 dark:border-gray-800",
            "shadow-lg dark:shadow-lg dark:shadow-gray-950/50"
          )}
        >
          <h2 className={cn(
            "text-xl font-semibold text-center",
            "text-gray-800 dark:text-gray-100",
            "transition-colors"
          )}>
            Ajouter un Statut
          </h2>
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  "text-gray-700 dark:text-gray-300",
                  "transition-colors"
                )}>
                  Statut
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Saisissez le statut..." 
                    {...field} 
                    className={cn(
                      "focus-visible:ring-2 focus-visible:ring-blue-500",
                      "bg-white dark:bg-gray-800",
                      "border-gray-300 dark:border-gray-700",
                      "text-gray-900 dark:text-gray-100",
                      "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                      "hover:border-gray-400 dark:hover:border-gray-600",
                      "transition-colors"
                    )}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className={cn(
                  "text-red-500 dark:text-red-400 text-sm",
                  "transition-colors"
                )} />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className={cn(
                "w-full transition-colors",
                "bg-blue-600 hover:bg-blue-700",
                "dark:bg-blue-700 dark:hover:bg-blue-800",
                "dark:shadow-sm dark:shadow-blue-900/30",
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
            
            <Button 
              type="button" 
              variant="outline"
              className={cn(
                "w-full transition-colors",
                "border-gray-300 hover:bg-gray-100",
                "dark:border-gray-700 dark:hover:bg-gray-800/70",
                "text-gray-800 dark:text-gray-200",
                "hover:border-gray-400 dark:hover:border-gray-600",
                "dark:shadow-sm dark:shadow-gray-950/20"
              )}
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