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
import { useNavigate } from 'react-router-dom';
import { ConsommaationApi } from "../../Api/consommationApi";
import { useEffect } from "react";
import { OfApi } from "../../Api/ofApi";
import { ArticleApi } from "../../Api/ArticleApi";
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
    .max(999999, { message: "Quantité trop élevée" })
    .refine(val => !isNaN(val)),
  qteChute: z.number()
    .min(0, { message: "Ne peut pas être négatif" })
    .max(999999, { message: "Quantité trop élevée" })
    .refine(val => !isNaN(val)),
});

export function ConsommationForm() {
  const navigate = useNavigate();
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

  const { data: ofsData, isLoading: isOfsLoading, error: ofsError } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur de chargement des OFs", {
        description: error.message,
      });
    }
  });

  const { data: articlesData, isLoading: isArticlesLoading, error: articlesError } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur de chargement des articles", {
        description: error.message,
      });
    }
  });

  const { mutate: submitConsommation, isPending } = useMutation({
    mutationFn: async (values) => {
      return await ConsommaationApi.createConsommation(values);
    },
    onSuccess: (data) => {
      toast.success("Consommation enregistrée avec succès", {
        action: {
          label: "Voir",
          onClick: () => navigate(`/consommations/${data.id}`),
        },
      });
      queryClient.invalidateQueries({ queryKey: ['consommations'] });
      form.reset();
    },
    onError: (error) => {
      toast.error("Erreur lors de l'enregistrement", {
        description: error.response?.data?.message || error.message,
        action: {
          label: "Réessayer",
          onClick: () => form.handleSubmit(onSubmit)(),
        },
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

    submitConsommation({
      ArticleMatiere: values.articleMatiere,
      Date: formattedDate,
      Num_LotOF: values.numeroLot,
      OF: values.of,
      ArticleOF: values.articleOF,
      Qte_Conso: values.qteConso,
      Qte_Chute: values.qteChute
    });
  };

  useEffect(() => {
    return () => form.reset();
  }, [form]);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <div className="bg-primary dark:bg-primary/90 px-6 py-4 rounded-t-lg -mt-6">
          <h1 className="text-2xl font-bold text-primary-foreground text-center">
            Formulaire de Consommation
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
                          text="Sélectionnez un article"
                          place="Rechercher un article..."
                          value={field.value}
                          onChange={field.onChange}
                          required
                          disabled={isArticlesLoading || !!articlesError}
                          error={!!articlesError}
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
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">
                        Date*
                      </FormLabel>
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
                              aria-label="Sélectionner une date"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={'fr'}
                            captionLayout="dropdown-buttons"
                            fromYear={2020}
                            toYear={new Date().getFullYear() + 1}
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
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">
                        N° Lot*
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Numéro de lot" 
                          {...field} 
                          autoComplete="off"
                          aria-describedby="numeroLot-help"
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
                          disabled={isOfsLoading || !!ofsError}
                          error={!!ofsError}
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
                          disabled={isArticlesLoading || !!articlesError}
                          error={!!articlesError}
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
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">
                        Quantité Consommée*
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          aria-describedby="qteConso-help"
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
                      <FormLabel className="text-foreground/80 dark:text-foreground/70">
                        Quantité Chute
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          aria-describedby="qteChute-help"
                          className="bg-background dark:bg-background/95"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive dark:text-destructive-foreground" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/consommation')}
                  disabled={isPending}
                  className="border-input hover:bg-accent dark:hover:bg-accent/50"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="min-w-[120px]"
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
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