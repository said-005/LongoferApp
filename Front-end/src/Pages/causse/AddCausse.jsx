"use client";

import { useForm } from "react-hook-form";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CausseApi } from "@/api/causseApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  code_causse: z.string().min(1, {
    message: "Le code cause doit contenir au moins 1 caractère",
  }),
  causse: z.string().min(1, {
    message: "La description doit contenir au moins 1 caractère",
  }),
});

export function CausseForm({ initialData, onSuccess }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code_causse: "",
      causse: "",
    },
  });

  const { mutate: submitCausse, isPending } = useMutation({
    mutationFn: (values) => CausseApi.createCausse(values),
    onSuccess: (data) => {
      toast.success( "Cause cree aves success",
        {
          description: `Code: ${data.data.data.code_causse}`,
          className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["causses"] });
      onSuccess?.();
       navigate('/causse');
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi", {
        description: error.response.data.message,
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
  });

  const onSubmit = (values) => {
    submitCausse(values);
  };

  const handleCancel = () => {
    navigate('/causse');
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
          "space-y-6 w-full max-w-md p-6 rounded-lg",
          "bg-white dark:bg-gray-900",
          "border border-gray-200 dark:border-gray-800",
          "shadow-lg dark:shadow-gray-950/50"
        )}>
          <h1 className={cn(
            "text-2xl font-bold text-center",
            "text-gray-800 dark:text-gray-100"
          )}>
            {initialData ? "Modifier la Cause" : "Ajouter une Cause"}
          </h1>

          <FormField
            control={form.control}
            name="code_causse"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  "text-gray-700 dark:text-gray-300"
                )}>
                  Code Cause
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez le code cause"
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
  name="causse"
  render={({ field }) => (
    <FormItem>
      <FormLabel className={cn(
        "text-gray-700 dark:text-gray-300"
      )}>
        Description
      </FormLabel>
      <FormControl>
        <Textarea
          placeholder="Entrez la description"
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

          <div className="flex justify-end gap-4 pt-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleCancel}
              className={cn(
                "border-gray-300 hover:bg-gray-100",
                "dark:border-gray-700 dark:hover:bg-gray-800",
                "text-gray-800 dark:text-gray-200"
              )}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className={cn(
                "bg-blue-600 hover:bg-blue-700",
                "dark:bg-blue-700 dark:hover:bg-blue-800",
                "text-white dark:text-gray-100"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Mise à jour..." : "Création..."}
                </>
              ) : (
                <>{initialData ? "Mettre à jour" : "Créer"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}