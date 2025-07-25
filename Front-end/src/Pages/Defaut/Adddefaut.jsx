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
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DefautApi } from "../../Api/defautApi";

// Define TypeScript type for form values


// Schema validation
const formSchema = z.object({
  codeDefaut: z.string()
    .min(1, { message: "Le code défaut est requis" })
    .max(20, { message: "Le code ne doit pas dépasser 20 caractères" }),
  defautDescription: z.string()
    .min(10, { message: "La description doit contenir au moins 10 caractères" })
    .max(500, { message: "La description ne doit pas dépasser 500 caractères" })
});

export function DefautForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeDefaut: "",
      defautDescription: ""
    },
  });

  // React Query mutation for creating a defaut with proper typing
  const { mutate: createDefaut, isPending } = useMutation({
    mutationFn: (values) => DefautApi.createDefaut(values),
    onSuccess: () => {
      toast.success("Le défaut a été créé avec succès");
      queryClient.invalidateQueries({ queryKey: ['defauts'] });

    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue lors de la création du défaut");
    },
  
  });

  function onSubmit(values) {
    createDefaut(values);
  }

  const handleCancel = () => {
    navigate('/defaut');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl mt-29 shadow-2xl rounded-2xl mx-auto p-3">
        <h1 className="text-2xl text-center font-bold">Defaut Form</h1>
        
        {/* Code Défaut Field */}
        <FormField
          control={form.control}
          name="codeDefaut"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Code Défaut*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: DF123"
                  {...field}
                  className="border-gray-300 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Description de Défaut Field */}
        <FormField
          control={form.control}
          name="defautDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description du Défaut*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez le défaut en détail..."
                  {...field}
                  className="min-h-[120px] border-gray-300 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            type="button"
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="min-w-[120px]"
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