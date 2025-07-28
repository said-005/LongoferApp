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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OfApi } from "../../Api/ofApi";
import { ArticleApi } from "../../Api/ArticleApi";
import AutocompleteInput from "../../AutoComplet/AutoCompletInput";
import { TubeHSApi } from "../../Api/TubeHSApi";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SheetCloseComponent from './../SheetClose';
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ProductionApi } from "../../Api/ProductionApi";

const formSchema = z.object({
  article: z.string().min(1, "L'article est requis"),
  of: z.string().min(1, "L'OF est requis"),
  date: z.date({ required_error: "La date est requise" }),
  qteChuteHs: z.number()
    .min(1, "La quantité doit être positive"),
  ref_production: z.string().min(1, "Le code tube HS est requis")
});

export function UpdateTubeHS({ id }) {
 
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      article: "",
      of: "",
      qteChuteHs: 0,
      ref_production: "",
      date: new Date()
    },
  });

  // Fetch specific tube HS data
  const { data: tubeHS, isLoading: isTubeHSLoading } = useQuery({
    queryKey: ['tube_HS', id],
    queryFn: async () => {
      const response = await TubeHSApi.getTube_HSById(id);
      return response.data.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error("Erreur de chargement du tube HS", {
        description: error.response?.data?.message || error.message,
      });
    }
  });
console.log('the tube HS data',tubeHS)
  // Populate form when data is loaded
  useEffect(() => {
    if (tubeHS) {
      const date = tubeHS.Date ? new Date(tubeHS.Date) : new Date();
      form.reset({
        article: tubeHS.Article,
        of: tubeHS.OF,
        qteChuteHs: tubeHS.Qte_Chute_HS,
        ref_production: tubeHS.ref_production,
        date
      });
    }
  }, [tubeHS, form]);

  // Fetch OFs and articles
  const { data: ofsData, isLoading: isOfsLoading } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur de chargement des OFs", {
        description: error.response?.data?.message || error.message,
      });
    }
  });

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Erreur de chargement des articles", {
        description: error.response?.data?.message || error.message,
      });
    }
  });
const { data: productions = [] } = useQuery({ 
      queryKey: ['productionOptions'],
      queryFn: async () => {const response = await ProductionApi.getAll();
  const formatted = response.data.data.map((pro) => ({
    label: `${pro.production_code}`,
    value: pro.production_code
  }));
    // ✅ This will show you the final array
  return formatted;
      }
    });
  // Prepare autocomplete options
  const ofsOptions = ofsData?.data?.data?.map((of) => ({
    label: of.codeOf,
    value: of.codeOf,
  })) || [];

  const articlesOptions = articlesData?.data?.data?.map((article) => ({
    label: `${article.codeArticle} - ${article.ArticleName}`,
    value: article.codeArticle,
  })) || [];

  // Update mutation
  const { mutate: updateTubeHS, isPending } = useMutation({
    mutationFn: async (values) => {
      await TubeHSApi.updateTube_HS(id, values);
    },
    onSuccess: () => {
      toast.success('Tube HS mis à jour avec succès');
      queryClient.invalidateQueries(['tube_HSs']);
      queryClient.invalidateQueries(['tube_HS', id]);
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour', {
        description: error.response?.data?.message || error.message,
      });
    }
  });

  const onSubmit = (values) => {
    const dateObj = new Date(values.date);
    const pad = (num) => String(num).padStart(2, '0');
    const formattedDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    
    updateTubeHS({
      ref_production: values.ref_production,
      Article: values.article,
      OF: values.of,
      Qte_Chute_HS: values.qteChuteHs,
      Date: formattedDate
    });
  };

  if (isTubeHSLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="bg-primary dark:bg-primary/90 px-6 py-4 rounded-t-lg -mt-6">
          <h1 className="text-2xl font-bold text-primary-foreground text-center">
            Modifier Tube HS
          </h1>
        </div>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {/* Code Tube HS */}
                           <FormField
                                      control={form.control}
                                      name="ref_production"
                                      render={({ field }) => (
                                        <FormItem>
                                         
                                          <FormControl>
                                            <AutocompleteInput
                                              data={productions}
                                              text="Sélectionnez une référence production"
                                              place="Choisissez parmi les suggestions"
                                              value={field.value || ''}
                                              onChange={(value) => field.onChange(value || '')}
                                              required
                                              className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            />
                                          </FormControl>
                                          <FormMessage className="dark:text-red-400" />
                                        </FormItem>
                                      )}
                                    />
              
              {/* Article */}
              <FormField
                control={form.control}
                name="article"
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
                        disabled={isArticlesLoading}
                        className="bg-background dark:bg-background/95"
                        aria-label="Sélectionner un article"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive dark:text-destructive-foreground text-xs" />
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
                        disabled={isOfsLoading}
                        className="bg-background dark:bg-background/95"
                        aria-label="Sélectionner un OF"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive dark:text-destructive-foreground text-xs" />
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
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              "bg-background dark:bg-background/95"
                            )}
                            aria-label="Sélectionner une date"
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                          locale={fr}
                          className="bg-background dark:bg-background/95"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-destructive dark:text-destructive-foreground text-xs" />
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={form.control}
                name="qteChuteHs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 dark:text-foreground/70">
                      Quantité Chute/HS (kg)*
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="bg-background dark:bg-background/95"
                        aria-describedby="qteChuteHs-help"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive dark:text-destructive-foreground text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6 justify-center items-center">
                  <div className="w-1/4 -mt-1">
                  <SheetCloseComponent className="border-input hover:bg-accent dark:hover:bg-accent/50" />
                </div>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      En cours...
                    </>
                  ) : (
                    "Mettre à jour"
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