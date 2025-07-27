"use client";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AutocompleteInput from './../../AutoComplet/AutoCompletInput';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConsommaationApi } from "../../Api/consommationApi";
import { useEffect } from "react";
import { OfApi } from "../../Api/ofApi";
import { ArticleApi } from "../../Api/ArticleApi";
import SheetCloseComponent from './../SheetClose';
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  articleMatiere: z.string()
    .min(1, { message: "Veuillez sélectionner une matière" })
    .max(50, { message: "Maximum 50 caractères" }),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
    invalid_type_error: "Format de date invalide",
  }),
  numeroLot: z.string()
    .min(1, { message: "Le numéro de lot est obligatoire" })
    .max(20, { message: "Maximum 20 caractères" }),
  of: z.string()
    .min(1, { message: "Veuillez sélectionner un OF" })
    .max(20, { message: "Maximum 20 caractères" }),
  articleOF: z.string()
    .min(1, { message: "Veuillez sélectionner un article" })
    .max(50, { message: "Maximum 50 caractères" }),
  qteConso: z.number()
    .min(0.01, { message: "Doit être supérieur à 0" })
    .max(999999, { message: "Quantité trop élevée" }),
  qteChute: z.number()
    .min(0, { message: "Ne peut pas être négatif" })
    .max(999999, { message: "Quantité trop élevée" }),
});

export function UpdateConsommation({id}) {
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleMatiere: "",
      numeroLot: "",
      of: "",
      articleOF: "",
      qteConso: 0,
      qteChute: 0,
      date: new Date(),
    },
  });

  // Fetch existing consommation data if in edit mode
  const { data: consommationData } = useQuery({
    queryKey: ['consommation', id],
    queryFn: async () => {
      const re = await ConsommaationApi.getConsommationById(id);
      return re.data.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error("Erreur de chargement des données", {
        description: error.message,
      });
    }
  });

  useEffect(() => {
    if (consommationData) {
      const date = consommationData.Date ? new Date(consommationData.Date) : new Date();
      form.reset({
        articleMatiere: consommationData.ArticleMatiere || "",
        numeroLot: consommationData.Num_LotOF || "",
        of: consommationData.OF || "",
        articleOF: consommationData.ArticleOF || "",
        qteConso: consommationData.Qte_Conso || 0,
        qteChute: consommationData.Qte_Chute || 0,
        date,
      });
    }
  }, [consommationData, form]);

  // Data fetching for dropdowns
  const { data: ofsData } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const { data: articlesData } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: (values) => ConsommaationApi.updateConsommation(id, values),
    onSuccess: () => {
      const action = "mise à jour";
      toast.success(`Consommation ${action} avec succès`);
      queryClient.invalidateQueries(['consommations']);
      if (!id) form.reset();
    },
    onError: (error) => {
      toast.error(`Erreur lors de ${id ? "la mise à jour" : "l'enregistrement"}`, {
        description: error.response?.data?.message || error.message,
      });
    }
  });

  const ofsOptions = ofsData?.data?.data?.map((of) => ({
    label: of.codeOf,
    value: of.codeOf,
  })) || [];

  const articlesOptions = articlesData?.data?.data?.map((article) => ({
    label: `${article.codeArticle} - ${article.ArticleName}`,
    value: article.codeArticle,
  })) || [];

  const onSubmit = (values) => {
    const dateObj = new Date(values.date);
    const pad = (num) => String(num).padStart(2, '0');
    const formattedDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;

    const payload = {
      ArticleMatiere: values.articleMatiere,
      Date: formattedDate,
      Num_LotOF: values.numeroLot,
      OF: values.of,
      ArticleOF: values.articleOF,
      Qte_Conso: values.qteConso,
      Qte_Chute: values.qteChute
    };
    mutation.mutate(payload);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <div className="bg-primary dark:bg-primary/90 px-6 py-4 rounded-t-lg -mt-6">
          <h1 className="text-2xl font-bold text-primary-foreground text-center ">
          Modifier la Consommation 
          </h1>
        </div>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-2">
                {/* Article Matière */}
                <FormField
                  control={form.control}
                  name="articleMatiere"
                  render={({ field }) => (
                    <FormItem>
                     
                      <FormControl>
                        <AutocompleteInput
                          data={articlesOptions}
                          text="Sélectionnez une article"
                          place="Rechercher une article..."
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="bg-background dark:bg-background/95"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                                "bg-background dark:bg-background/95"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Choisir une date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="bg-background dark:bg-background/95"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                {/* N° Lot */}
                <FormField
                  control={form.control}
                  name="numeroLot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">N° Lot*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Entrez le numéro de lot" 
                          {...field}
                          className="bg-background dark:bg-background/95"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                {/* OF */}
                <FormField
                  control={form.control}
                  name="of"
                  render={({ field }) => (
                    <FormItem>
     
                      <FormControl>
                        <AutocompleteInput
                          data={ofsOptions}
                          text="Sélectionnez un OF"
                          place="Rechercher un OF..."
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="bg-background dark:bg-background/95"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                {/* Article OF */}
                <FormField
                  control={form.control}
                  name="articleOF"
                  render={({ field }) => (
                    <FormItem>
                 
                      <FormControl>
                        <AutocompleteInput
                          data={articlesOptions}
                          text="Sélectionnez un article"
                          place="Rechercher un article..."
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="bg-background dark:bg-background/95"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                {/* Qte Conso */}
                <FormField
                  control={form.control}
                  name="qteConso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">Quantité Consommée*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="bg-background dark:bg-background/95"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                {/* Qte Chute */}
                <FormField
                  control={form.control}
                  name="qteChute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">Quantité Chute</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="bg-background dark:bg-background/95"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end items-center gap-4 pt-6">
                <div className="w-1/3">
                  <SheetCloseComponent className="border-input hover:bg-accent dark:hover:bg-accent/50" />
                </div>
                
                <Button 
                  type="submit" 
                  className="min-w-[120px]"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {id ? "Mise à jour..." : "Enregistrement..."}
                    </>
                  ) : (
                    id ? "Mettre à jour" : "Enregistrer"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}