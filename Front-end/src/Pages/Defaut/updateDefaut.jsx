import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DefautApi } from "../../Api/defautApi";
import SheetCloseComponent from "../SheetClose";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  codeDefaut: z.string()
    .min(1, { message: "Le code défaut est requis" }),
  defautDescription: z.string()
    .min(10, { message: "La description doit contenir au moins 10 caractères" })
});

export function UpdateDefaut({ id }) {
  const queryClient = useQueryClient();

  // Fetch existing defaut data
  const { data: existingDefaut, isLoading: isLoadingDefaut } = useQuery({
    queryKey: ['defaut', id],
    queryFn: () => DefautApi.getDefautById(id),
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeDefaut: "",
      defautDescription: ""
    },
  });

  // Set form values when existing defaut data is loaded
  useEffect(() => {
    if (existingDefaut?.data?.data) {
      form.reset({
        codeDefaut: existingDefaut.data.data.codeDefaut,
        defautDescription: existingDefaut.data.data.defautDescription
      });
    }
  }, [existingDefaut, form]);

  // Mutation for updating/creating defaut
  const { mutate: updateDefaut, isPending } = useMutation({
    mutationFn: (values) =>  DefautApi.updateDefaut(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defauts'] });
      queryClient.invalidateQueries({ queryKey: ['defaut', id] });
      toast.success("Défaut mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du défaut");
    }
  });

  function onSubmit(values) {
    updateDefaut(values);
  }

  if (isLoadingDefaut && id) {
    return (
      <div className="flex justify-center p-4">
        <Card className="w-full max-w-2xl p-6 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4 w-full min-h-full">
      <Card className="w-full max-w-2xl p-6 shadow-lg dark:shadow-gray-800">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full">
            <h1 className="text-2xl text-center font-bold text-foreground dark:text-foreground/90">
              {id ? "Modifier Défaut" : "Ajouter Défaut"}
            </h1>

            <FormField
              control={form.control}
              name="codeDefaut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground/80 dark:text-foreground/70">
                    Code du Défaut
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez le code défaut"
                      {...field}
                      className="bg-background dark:bg-background/95 border-input focus:ring-2 focus:ring-primary/50"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-destructive-foreground" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defautDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground/80 dark:text-foreground/70">
                    Description du Défaut
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le défaut en détail..."
                      {...field}
                      className="min-h-[120px] bg-background dark:bg-background/95 border-input focus:ring-2 focus:ring-primary/50"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-destructive-foreground" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 items-center">
              <div className="w-1/4 -mt-1">
                <SheetCloseComponent className="border-input hover:bg-accent dark:hover:bg-accent/50" />
              </div>
              <Button 
                type="submit" 
                disabled={isPending}
                className="min-w-[120px] bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    {"Mise à jour..."}
                  </span>
                ) : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}