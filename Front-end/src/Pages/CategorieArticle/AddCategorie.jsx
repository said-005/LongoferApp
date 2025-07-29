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
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategorieApi } from "../../Api/CategorieApi";

// Schema with validation messages in French
const formSchema = z.object({
  CategorieArticle: z.string({
    required_error: "Le nom de la catégorie est requis",
  })
  .min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  })
});

export function CategoryForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CategorieArticle: "",
    },
  });

  // React Query mutation for creating a category
  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: (values) => 
      CategorieApi.createCategorie(values),
    onSuccess: () => {
      toast.success("Catégorie créée avec succès");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/categorie');
    },
    onError: (error) => {
      toast.error("Erreur lors de la création", {
        description: error.response.data.message || "Une erreur est survenue",
      });
    }
  });

  const onSubmit = (values) => {
    createCategory(values);
  };

  const handleCancel = () => {
    navigate('/categorie');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800 mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Nouvelle Catégorie
          </h2>
          
          <FormField
            control={form.control}
            name="CategorieArticle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2 font-medium text-gray-900 dark:text-gray-300">
                  Nom de la catégorie
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    placeholder="Entrez le nom de la catégorie"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isPending}
              className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Annuler
            </Button>
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
    </div>
  );
}