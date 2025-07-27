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
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OfApi } from "../../Api/ofApi";
import { ArticleApi } from "../../Api/ArticleApi";
import AutocompleteInput from "../../AutoComplet/AutoCompletInput";
import { useNavigate } from "react-router-dom";
import { TubeHSApi } from "../../Api/TubeHSApi";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  article: z.string().min(1, "L'article est requis").max(50, "Maximum 50 caractères"),
  of: z.string().min(1, "L'OF est requis").max(20, "Maximum 20 caractères"),
  date: z.date({ required_error: "La date est requise" }),
  qteChuteHs: z.number()
    .min(0.01, "La quantité doit être positive")
    .max(999999, "Quantité trop élevée"),
  code_tube_HS: z.string().min(1, "Le code tube HS est requis")
});

export function TubeHSForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      article: "",
      of: "",
      qteChuteHs: 0,
      code_tube_HS: "",
      date: new Date()
    },
  });

  // Fetch OFs and articles in parallel
  const { data: ofsData, isLoading: isOfsLoading } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Échec du chargement des OFs", {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error("Échec du chargement des articles", {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  // Prepare options for autocomplete
  const ofsOptions = ofsData?.data?.data?.map((of) => ({
    label: of.codeOf,
    value: of.codeOf,
  })) || [];

  const articlesOptions = articlesData?.data?.data?.map((article) => ({
    label: `${article.codeArticle} - ${article.ArticleName}`,
    value: article.codeArticle,
  })) || [];

  const { mutate: createTubeHS, isPending } = useMutation({
    mutationFn: (values) => TubeHSApi.createTube_HS(values),
    onSuccess: () => {
      toast.success('Tube HS créé avec succès');
      queryClient.invalidateQueries(['tube_HSs']);
      navigate('/tubeHS');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création', {
        description: error.response?.data?.message || 'Une erreur est survenue',
      });
    }
  });

  const onSubmit = (values) => {
    const dateObj = new Date(values.date);
    const pad = (num) => String(num).padStart(2, '0');
    const formattedDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;

    createTubeHS({
      code_tube_HS: values.code_tube_HS,
      Article: values.article,
      OF: values.of,
      Qte_Chute_HS: values.qteChuteHs,
      Date: formattedDate
    });
  };

  const handleCancel = () => {
    navigate('/tubeHS');
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="bg-primary dark:bg-primary/90 px-6 py-4 rounded-t-lg -mt-6">
          <h1 className="text-2xl font-bold text-primary-foreground text-center">
            Formulaire Tube HS
          </h1>
        </div>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Code Tube HS */}
              <FormField
                control={form.control}
                name="code_tube_HS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 dark:text-foreground/70">
                      Code Tube HS*
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ex: CTH-0001" 
                        {...field} 
                        className="bg-background dark:bg-background/95"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive dark:text-destructive-foreground text-xs" />
                  </FormItem>
                )}
              />
              
              {/* Article */}
              <FormField
                control={form.control}
                name="article"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 dark:text-foreground/70">
                      Article*
                    </FormLabel>
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
                    <FormLabel className="text-foreground/80 dark:text-foreground/70">
                      OF*
                    </FormLabel>
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
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-background dark:bg-background/95"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive dark:text-destructive-foreground text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-input hover:bg-accent dark:hover:bg-accent/50"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      En cours...
                    </>
                  ) : "Valider"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}