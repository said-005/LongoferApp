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
  const queryClient = useQueryClient();

  const { data: clientsData, isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientApi.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: submitOF, isPending: isSubmitting } = useMutation({
    mutationFn: (data) => OfApi.createOF(data),
    onSuccess: () => {
      toast.success("Ordre de fabrication créé avec succès");
      queryClient.invalidateQueries('ofs');
      navigate('/Of');
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'OF", {
        description: error.message || "Veuillez réessayer",
      });
    }
  });

  const clientOptions = clientsData?.data?.data?.map((client) => ({
    label: client.Client,
    value: client.codeClient,
  })) || [];

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
    const formatDate = (date) => date.toISOString().split('T')[0];

    const payload = {
      codeOf: values.ofNumber,
      client: values.client,
      Article_1: values.article1,
      Article_2: values.article2,
      Article_3: values.article3,
      Article_4: values.article4,
      Article_5: values.article5,
      Revetement_Ext: values.externalCoating,
      Revetement_Int: values.internalCoating,
      Sablage_Ext: values.externalSandblasting,
      Sablage_Int: values.internalSandblasting,
      Manchette_ISO: values.isoSleeve,
      date_Prevue_Livraison: formatDate(values.deliveryDate),
      Date_OF: formatDate(values.ofDate)
    };
    submitOF(payload);
  }

  const handleAnnuler = () => {
    navigate('/Of');
  };

  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy', { locale: fr });
  };

  return (
    <div className="w-full h-full flex justify-center flex-col items-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="border-b">
          <h1 className="text-2xl font-bold text-center">
            Ordre de Fabrication
          </h1>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ofNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° OF</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="OF-12345" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
              
                      <FormControl>
                        <AutocompleteInput
                          data={clientOptions}
                          text="Sélectionnez un client"
                          place="Choisissez parmi les suggestions"
                          value={field.value}
                          onChange={field.onChange}
                          required={true}
                          disabled={isClientsLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="ofDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date OF</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
                          <input
                            type="date"
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            value={field.value?.toISOString().split('T')[0] || ''}
                            className="p-2 w-full border rounded-md"
                            min="1900-01-01"
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Prévue livraison</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
                          <input
                            type="date"
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            value={field.value?.toISOString().split('T')[0] || ''}
                            className="p-2 w-full border rounded-md"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex justify-end pt-6 gap-3 border-t">
                <Button 
                  type="button" 
                  onClick={handleAnnuler} 
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
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