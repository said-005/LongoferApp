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
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { SheetClose } from "@/components/ui/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategorieApi } from "../../Api/CategorieApi";
import { useEffect } from "react";

// Schema with French validation messages
const formSchema = z.object({
  CategorieArticle: z.string({
    required_error: "Le nom de la catégorie est requis",
  })
  .min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  })
  .max(50, {
    message: "Le nom ne doit pas dépasser 50 caractères",
  }),
});

export function UpdateCategorie({ id }) {
  const queryClient = useQueryClient();
  
  // Fetch category data
  const { data: categoryData } = useQuery({
    queryKey: ['category', id],
    queryFn: () => CategorieApi.getCategorieById(id),
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CategorieArticle: "",
    },
  });

  // Set form values when category data is loaded
  useEffect(() => {
    if (categoryData?.data?.data?.CategorieArticle) {
      form.reset({
        CategorieArticle: categoryData.data.data.CategorieArticle,
      });
    }
  }, [categoryData, form]);

  // Mutation for updating category
  const { mutate: updateCategory, isPending } = useMutation({
    mutationFn: (values) => 
      CategorieApi.updateCategorie(id, values),
    onSuccess: () => {
      toast.success("Catégorie mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour", {
        description: error.message || "Une erreur est survenue",
      });
    }
  });

  const onSubmit = (values) => {
    updateCategory(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Modifier la Catégorie
        </h2>
        
        <FormField
          control={form.control}
          name="CategorieArticle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-900 dark:text-gray-300">
                Nom de la catégorie*
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  placeholder="Entrez le nom de la catégorie"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <SheetClose asChild>
            <Button 
              type="button" 
              variant="outline"
              disabled={isPending}
              className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Fermer
            </Button>
          </SheetClose>
          <Button 
            type="submit" 
            disabled={isPending}
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Enregistrement...
              </span>
            ) : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}