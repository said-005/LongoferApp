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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { StatutApi } from "../../Api/StatutApi";
import SheetCloseComponent from "../SheetClose";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  status: z.string({
    required_error: "Le statut est requis",
  })
  .min(1, "Le statut ne peut pas être vide")
  .max(50, "Le statut doit contenir moins de 50 caractères"),
});

export function UpdateStatut({ id }) {
  const queryClient = useQueryClient();

  // Fetch existing status data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['statut', id],
    queryFn: () => StatutApi.getStatuById(id),
    onError: (error) => {
      toast.error("Erreur de chargement", {
        description: error.message || "Impossible de charger le statut",
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    },
    enabled: !!id,
  });

  // Form initialization
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (data) {
      form.reset({
        status: data.data.data.Statut,
      });
    }
  }, [data, form]);

  // Update mutation
  const { mutate: updateStatut, isPending } = useMutation({
    mutationFn: (values) => StatutApi.updateStatut(id, values),
    onSuccess: () => {
      toast.success("Statut mis à jour", {
        description: "Le statut a été modifié avec succès",
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      queryClient.invalidateQueries(['statuts']);
      queryClient.invalidateQueries(['statut', id]);
    },
    onError: (error) => {
      toast.error("Échec de la mise à jour", {
        description: error.message || "Une erreur est survenue",
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    }
  });

  const onSubmit = (values) => {
    updateStatut({
      Statut: values.status
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
        Impossible de charger le statut
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="flex justify-center items-start pt-10 min-h-[200px] rounded-lg p-4">
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className={cn(
            "space-y-6 w-full max-w-md p-6 rounded-lg shadow-md",
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
            Modifier le Statut
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
                  Statut*
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
          
          <div className="-mt-2">
            <SheetCloseComponent className="w-full" />
          </div>
        </form>      
      </div>
    </Form>
  );
}