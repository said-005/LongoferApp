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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import AutocompleteInput from './../../AutoComplet/AutoCompletInput';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArticleApi } from './../../Api/ArticleApi';
import { ClientApi } from './../../Api/ClientApi';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { OfApi } from "../../Api/ofApi";
import { useEffect, useMemo } from "react";
import SheetCloseComponent from './../SheetClose';

const REQUIRED_FIELD_MESSAGE = "Ce champ est requis";
const STALE_TIME = 1; // 5 minutes cache

const formSchema = z.object({
  ofNumber: z.string().min(1, REQUIRED_FIELD_MESSAGE),
  client: z.string().min(1, REQUIRED_FIELD_MESSAGE),
  article1: z.string().min(1, REQUIRED_FIELD_MESSAGE),
  article2: z.string().optional(),
  article3: z.string().optional(),
  article4: z.string().optional(),
  article5: z.string().optional(),
  ofDate: z.date({ required_error: REQUIRED_FIELD_MESSAGE }),
  deliveryDate: z.date({ required_error: REQUIRED_FIELD_MESSAGE }),
  externalCoating: z.boolean(),
  externalSandblasting: z.boolean(),
  internalSandblasting: z.boolean(),
  internalCoating: z.boolean(),
  isoSleeve: z.boolean(),
});

const SWITCH_FIELDS = [
  { name: "externalCoating", label: "Revêtement Extérieur" },
  { name: "externalSandblasting", label: "Sablage Extérieur" },
  { name: "internalSandblasting", label: "Sablage Intérieur" },
  { name: "internalCoating", label: "Revêtement Intérieur" },
  { name: "isoSleeve", label: "Manchette ISO" },
];

export function UpdateOf({ id }) {
  const queryClient = useQueryClient();

  // Data fetching
  const { data: ofData, isLoading: isOfLoading } = useQuery({
    queryKey: ['of', id],
    queryFn: () => OfApi.getOFById(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientApi.getAll,
    staleTime: STALE_TIME,
  });

  const { data: articlesData } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: STALE_TIME,
  });

  // Memoized options
  const clientOptions = useMemo(() => 
    clientsData?.data?.data?.map(client => ({
      label: client.Client,
      value: client.codeClient,
    })) || [], 
    [clientsData]
  );

  const articleOptions = useMemo(() => 
    articlesData?.data?.data?.map(article => ({
      label: article.ArticleName,
      value: article.codeArticle,
    })) || [], 
    [articlesData]
  );

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
  // Initialize form with fetched data
  useEffect(() => {
    if (ofData?.data) {
      const data = ofData.data.data;
      form.reset({
        ofNumber: data.codeOf || "",
        client: data.client || "",
        article1: data.Article_1 || "",
        article2: data.Article_2 || "",
        article3: data.Article_3 || "",
        article4: data.Article_4 || "",
        article5: data.Article_5 || "",
        ofDate: data.Date_OF ? new Date(data.Date_OF) : new Date(),
        deliveryDate: data.date_Prevue_Livraison ? new Date(data.date_Prevue_Livraison) : new Date(),
        externalCoating: Boolean(data.Revetement_Ext),
        externalSandblasting: Boolean(data.Sablage_Ext),
        internalSandblasting: Boolean(data.Sablage_Int),
        internalCoating: Boolean(data.Revetement_Int),
        isoSleeve: Boolean(data.Manchette_ISO),
      });
    }
  }, [ofData, form]);

  // Mutation for updating OF
  const { mutate: updateOF, isPending: isUpdating } = useMutation({
    mutationFn: (data) => OfApi.updateOF(id, transformFormData(data)),
    onSuccess: () => {
      toast.success("OF mis à jour avec succès");
      queryClient.invalidateQueries(['ofs']);
      queryClient.invalidateQueries(['of', id]);
    },
    onError: (error) => {
      toast.error("Erreur de mise à jour", {
        description: error.response.data.message || "Une erreur est survenue",
      });
    }
  });

  // Transform form data for API
  const transformFormData = (values) => ({
    codeOf: values.ofNumber,
    client: values.client,
    Article_1: values.article1,
    Article_2: values.article2 || undefined,
    Article_3: values.article3 || undefined,
    Article_4: values.article4 || undefined,
    Article_5: values.article5 || undefined,
    Revetement_Ext: values.externalCoating,
    Revetement_Int: values.internalCoating,
    Sablage_Ext: values.externalSandblasting,
    Sablage_Int: values.internalSandblasting,
    Manchette_ISO: values.isoSleeve,
    date_Prevue_Livraison: format(values.deliveryDate, 'yyyy-MM-dd'),
    Date_OF: format(values.ofDate, 'yyyy-MM-dd')
  });


  const isLoading = isOfLoading;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-foreground">Modifier l'Ordre de Fabrication</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <Form {...form}>
          <form 
            id="update-of-form" 
            onSubmit={form.handleSubmit(updateOF)} 
            className="space-y-4"
          >
            <div className="space-y-4">
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
                        disabled={isLoading}
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
                        required
                        disabled={isLoading}
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
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <DatePickerField 
                control={form.control}
                name="ofDate"
                label="Date OF"
                disabled={isLoading}
                maxDate={new Date()}
              />

              <DatePickerField 
                control={form.control}
                name="deliveryDate"
                label="Date livraison"
                disabled={isLoading}
                minDate={new Date()}
              />

              {SWITCH_FIELDS.map(({ name, label }) => (
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
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </form>
        </Form>
      </div>

      <div className="p-4 border-t flex items-center justify-end gap-2">
        <div className="w-1/3">
          <SheetCloseComponent />
        </div>
        
        <Button 
          type="submit" 
          form="update-of-form" 
          disabled={isUpdating || isLoading}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}

function DatePickerField({ control, name, label, disabled, minDate, maxDate }) {
  const formatDateDisplay = (date) => format(date, 'dd/MM/yyyy', { locale: fr });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    formatDateDisplay(field.value)
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
                min={minDate?.toISOString().split('T')[0]}
                max={maxDate?.toISOString().split('T')[0]}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}