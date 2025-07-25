"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import AutocompleteInput from './../../AutoComplet/AutoCompletInput';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArticleApi } from './../../Api/ArticleApi';
import { ClientApi } from './../../Api/ClientApi';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { OfApi } from "../../Api/ofApi";

// Define form schema with TypeScript types
const formSchema = z.object({
  ofNumber: z.string().min(1, "Le numéro OF est requis"),
  client: z.string().min(1, "Le client est requis"),
  article1: z.string().min(1, "L'article 1 est requis"),
  article2: z.string().optional(),
  article3: z.string().optional(),
  article4: z.string().optional(),
  article5: z.string().optional(),
  ofDate: z.date({
    required_error: "La date OF est requise",
  }),
  deliveryDate: z.date({
    required_error: "La date est requise",
  }),
  externalCoating: z.boolean(),
  externalSandblasting: z.boolean(),
  internalSandblasting: z.boolean(),
  internalCoating: z.boolean(),
  isoSleeve: z.boolean(),
});

export function OFForm() {
  const navigate = useNavigate();
  const queryClient=useQueryClient()
  // Fetch clients data
  const { data: clientsData, isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Fetch articles data
  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Mutation for submitting OF data
  const { mutate: submitOF, isPending: isSubmitting } = useMutation({
    mutationFn: (data) => OfApi.createOF(data),
    onSuccess: () => {
      toast.success("Ordre de fabrication créé avec succès");
        queryClient.invalidateQueries('ofs')
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'OF", {
        description: error.message || "Veuillez réessayer",
      });
    }
  });

  // Prepare client options for Autocomplete
  const clientOptions = clientsData?.data?.data?.map((client) => ({
    label: client.Client,
    value: client.codeClient,
  })) || [];

  // Prepare article options for Autocomplete
  const articleOptions = articlesData?.data?.data?.map((article) => ({
    label: article.ArticleName,
    value: article.codeArticle,
  })) || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ofNumber: "",
      client: "",
      article1: "",
      article2: "",
      article3: "",
      article4: "",
      article5: "",
      externalCoating: false,
      externalSandblasting: false,
      internalSandblasting: false,
      internalCoating: false,
      isoSleeve: false,
    },
  });

  function onSubmit(values) {
    console.log(values)
    const formatDate = (date) => date.toISOString().split('T')[0];

const payload = {
  date_Prevue_Livraison: formatDate(values.deliveryDate),
  Date_OF: formatDate(values.ofDate)
};
    // Format dates to ISO string before submission
    const formattedValues = {
     codeOf:values.ofNumber,
      client :values.client,
      Article_1 :values.article1,
      Article_2 :values.article2,
      Article_3 :values.article3,
      Article_4 :values.article4,
      Article_5 :values.article5,
      Revetement_Ext:values.externalCoating,
      Revetement_Int:values.internalCoating,
      Sablage_Ext:values.externalSandblasting,
      Sablage_Int:values.internalSandblasting,
      Manchette_ISO:values.isoSleeve,
      date_Prevue_Livraison: payload.date_Prevue_Livraison, // or toISOString()
      Date_OF:payload.Date_OF // or toISOString()

    };
    submitOF(formattedValues);
  }

  const handleAnnuler = () => {
    navigate('/Of');
  };

  // Format date for display using date-fns with French locale
  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy', { locale: fr });
  };

  return (
    <div className="w-full h-full flex justify-center flex-col items-center p-4 mt-10">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Ordre de Fabrication
          </h1>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* OF Number */}
                <FormField
                  control={form.control}
                  name="ofNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">N° OF*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="OF-12345" 
                          {...field} 
                          className="focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Client */}
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      
                      <FormControl>
                        <div className="-mt-1.5">
                          <AutocompleteInput
                            data={clientOptions}
                            text="Sélectionnez un client"
                            place="Choisissez parmi les suggestions"
                            value={field.value}
                            onChange={field.onChange}
                            required={true}
                            disabled={isClientsLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Articles */}
                {[1, 2, 3, 4, 5].map((num) => (
                  <FormField
                    key={num}
                    control={form.control}
                    name={`article${num}`}
                    render={({ field }) => (
                      <FormItem>
                        
                        <FormControl>
                          <AutocompleteInput
                            data={articleOptions}
                            text={`Sélectionnez un article ${num}`}
                            place="Choisissez parmi les suggestions"
                            value={field.value}
                            onChange={field.onChange}
                            required={num === 1}
                            disabled={isArticlesLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                ))}

                {/* OF Date */}
                <FormField
                  control={form.control}
                  name="ofDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">Date OF*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal h-11",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="rounded-md border shadow-sm">
                            <input
                              type="date"
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              value={field.value?.toISOString().split('T')[0] || ''}
                              className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                              min="1900-01-01"
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Delivery Date */}
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">Date Prévue livraison*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal h-11",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="rounded-md border shadow-sm">
                            <input
                              type="date"
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              value={field.value?.toISOString().split('T')[0] || ''}
                              className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Switches */}
                {[
                  { name: "externalCoating", label: "Revêtement Extérieur" },
                  { name: "externalSandblasting", label: "Sablage Extérieur" },
                  { name: "internalSandblasting", label: "Sablage Intérieur" },
                  { name: "internalCoating", label: "Revêtement Intérieur" },
                  { name: "isoSleeve", label: "Manchette ISO" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm hover:shadow transition-shadow">
                        <div className="space-y-0.5">
                          <FormLabel className="font-medium">{label}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end pt-6 gap-3 border-t">
                <Button 
                  type="button" 
                  onClick={handleAnnuler} 
                  variant="outline"
                  className="min-w-24 hover:bg-gray-100"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="min-w-24 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}