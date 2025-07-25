
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
import { CalendarIcon } from "lucide-react";
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
      date: new Date() // Set default date to today
    },
  });

  // Fetch OFs and articles in parallel
  const { data: ofsData, isLoading: isOfsLoading } = useQuery({
    queryKey: ['ofs'],
    queryFn: OfApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    onError: (error) => {
      toast.error("Échec du chargement des OFs", {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
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
    mutationFn:  (values) =>TubeHSApi.createTube_HS(values),
    
    onSuccess: () => {
      toast.success('Tube HS créé avec succès');
      queryClient.invalidateQueries(['tube_HSs']);
     
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
    Date: formattedDate // or "date" if that's what your backend uses
  });
};


  const handleCancel = () => {
    navigate('/tubeHS');
  };

  return (
    <div className="container mx-auto px-4 mt-15 py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Tube HS Shute Form</h1>
          
          {/* Code Tube HS */}
          <FormField
            control={form.control}
            name="code_tube_HS"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Code Tube HS*</FormLabel>
                <FormControl>
                  <Input placeholder="ex: CTH-0001" {...field} />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          
          {/* Article */}
          <FormField
            control={form.control}
            name="article"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Article*</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={articlesOptions}
                    text="Sélectionnez un article"
                    place="Rechercher un article..."
                    value={field.value}
                    onChange={field.onChange}
                    required
                    disabled={isArticlesLoading}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          {/* OF */}
          <FormField
            control={form.control}
            name="of"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">OF*</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={ofsOptions}
                    text="Sélectionnez un OF"
                    place="Rechercher un OF..."
                    value={field.value}
                    onChange={field.onChange}
                    required
                    disabled={isOfsLoading}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-medium">Date*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
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
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="qteChuteHs"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Quantité Chute/HS (kg)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? "En cours..." : "Valider"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}