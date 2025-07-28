"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
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
import { CausseApi } from "@/api/causseApi";
import SheetCloseComponent from "../SheetClose";
import { cn } from "@/lib/utils";

const FORM_SCHEMA = z.object({
  code_causse: z.string().min(1, {
    message: "Le code cause doit contenir au moins 1 caractères",
  }),
  causse: z.string().min(1, {
    message: "La description doit contenir au moins 1 caractères",
  }),
});

const ERROR_MESSAGES = {
  FETCH_ERROR: "Échec du chargement des données",
  UPDATE_ERROR: "Erreur lors de la mise à jour",
  SUCCESS: "Cause mise à jour avec succès",
};

export function UpdateCausse({ id, onSuccess }) {
  const queryClient = useQueryClient();

  // Fetch cause data
  const {
    data: causseData,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["causse", id],
    queryFn: () => CausseApi.getCausseById(id),
    onError: (err) => {
      toast.error(ERROR_MESSAGES.FETCH_ERROR, {
        description: err.response?.data?.message || err.message,
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
    enabled: !!id,
  });

  // Mutation for updating data
  const { mutate: updateCausse, isPending } = useMutation({
    mutationFn: (values) => CausseApi.updateCausse(id, values),
    onSuccess: (data) => {
      toast.success(ERROR_MESSAGES.SUCCESS, {
        description: `Code: ${data.code_causse}`,
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ["causses"] });
      queryClient.invalidateQueries({ queryKey: ["causse", id] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(ERROR_MESSAGES.UPDATE_ERROR, {
        description: error.response?.data?.message || error.message,
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
  });

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      code_causse: "",
      causse: "",
    },
  });

  // Update form defaults when data is loaded
  useEffect(() => {
    if (causseData?.data?.data) {
      form.reset(causseData.data.data);
    }
  }, [causseData, form]);

  const onSubmit = (values) => {
    updateCausse(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(
        "bg-destructive/10 border border-destructive text-destructive",
        "dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
        "p-4 rounded-lg"
      )}>
        <p>{ERROR_MESSAGES.FETCH_ERROR}</p>
        <p className="text-sm mt-1">
          {fetchError instanceof Error
            ? fetchError.message
            : "Erreur inconnue"}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
        "space-y-6 w-full max-w-md p-6 rounded-lg",
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-800",
        "shadow-md dark:shadow-gray-950/50"
      )}>
        <h2 className={cn(
          "text-xl font-bold text-center",
          "text-gray-800 dark:text-gray-100"
        )}>
          Modifier la Cause
        </h2>

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
                  placeholder="Entrez le code cause (ex: C01)"
                  {...field}
                  disabled={isPending}
                  aria-disabled={isPending}
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
                <Input
                  placeholder="Entrez la description"
                  {...field}
                  disabled={isPending}
                  aria-disabled={isPending}
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

        <div className="flex justify-end items-center flex-col gap-2  pt-2">
        
          <Button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className={cn(
              "w-full",
              "bg-blue-600 hover:bg-blue-700",
              "dark:bg-blue-700 dark:hover:bg-blue-800",
              "text-white dark:text-gray-100"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Mettre à jour"
            )}
          </Button>  
          <SheetCloseComponent className={cn(
            "border-gray-300 hover:bg-gray-100",
            "dark:border-gray-700 dark:hover:bg-gray-800",
            "text-gray-800 dark:text-gray-200"
          )} />
        </div>
      </form>
    </Form>
  );
}