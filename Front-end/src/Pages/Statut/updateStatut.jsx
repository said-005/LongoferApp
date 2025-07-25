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

// Schema with TypeScript type
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
      });
      queryClient.invalidateQueries(['statuts']);
      queryClient.invalidateQueries(['statut', id]);
    },
    onError: (error) => {
      toast.error("Échec de la mise à jour", {
        description: error.message || "Une erreur est survenue",
      });
    }
  });

  const onSubmit = (values) => {
    updateStatut({
      Statut:values.status
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-red-500">
        Impossible de charger le statut
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="flex justify-center items-start pt-10 min-h-[200px] rounded-lg p-4">
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6 w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold text-center">Modifier le Statut</h2>
          
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
          <div className="-mt-2">
            <SheetCloseComponent/>
          </div>
          
        </form>      
      </div>
    </Form>
  );
}