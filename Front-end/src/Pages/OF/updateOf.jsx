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

// Constants for repeated values
const REQUIRED_FIELD_MESSAGE = "Ce champ est requis";
const DATE_CONFIG = {
  required_error: REQUIRED_FIELD_MESSAGE,
};
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

// Form schema with improved validation messages
const formSchema = z.object({
  ofNumber: z.string().min(1, "Le numéro OF est requis"),
  client: z.string().min(1, REQUIRED_FIELD_MESSAGE),
  article1: z.string().min(1, REQUIRED_FIELD_MESSAGE),
  article2: z.string().optional(),
  article3: z.string().optional(),
  article4: z.string().optional(),
  article5: z.string().optional(),
  ofDate: z.date(DATE_CONFIG),
  deliveryDate: z.date(DATE_CONFIG),
  externalCoating: z.boolean(),
  externalSandblasting: z.boolean(),
  internalSandblasting: z.boolean(),
  internalCoating: z.boolean(),
  isoSleeve: z.boolean(),
});


// Switch configuration for cleaner rendering
const SWITCH_FIELDS = [
  { name: "externalCoating", label: "Revêtement Extérieur" },
  { name: "externalSandblasting", label: "Sablage Extérieur" },
  { name: "internalSandblasting", label: "Sablage Intérieur" },
  { name: "internalCoating", label: "Revêtement Intérieur" },
  { name: "isoSleeve", label: "Manchette ISO" },
] ;

export function UpdateOf({ id }) {
  const queryClient = useQueryClient();

  // Fetch existing OF data
  const { data: ofData, isLoading: isOfLoading } = useQuery({
    queryKey: ['of', id],
    queryFn: () => OfApi.getOFById(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });

  // Fetch clients data
  const { data: clientsData, isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientApi.getAll,
    staleTime: STALE_TIME,
  });

  // Fetch articles data
  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: ArticleApi.getAll,
    staleTime: STALE_TIME,
  });

  // Prepare options with useMemo for performance
  const clientOptions = useMemo(() => 
    clientsData?.data?.data?.map((client) => ({
      label: client.Client,
      value: client.codeClient,
    })) || [], 
    [clientsData]
  );

  const articleOptions = useMemo(() => 
    articlesData?.data?.data?.map((article) => ({
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

  // Mutation for updating OF data
  const { mutate: updateOF, isPending: isUpdating } = useMutation({
    mutationFn: (data) => OfApi.updateOF(id, transformFormData(data)),
    onSuccess: () => {
      toast.success("Ordre de fabrication mis à jour avec succès");
      queryClient.invalidateQueries(['ofs']);
      queryClient.invalidateQueries(['of', id]);
      
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de l'OF", {
        description: error.message || "Veuillez réessayer",
      });
    }
  });

  // Transform form data for API payload
  const transformFormData = (values) => {
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    return {
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
      date_Prevue_Livraison: formatDate(values.deliveryDate),
      Date_OF: formatDate(values.ofDate)
    };
  };

  // Pre-fill form when OF data is loaded
  useEffect(() => {
    if (ofData?.data) {
      const data = ofData.data;
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

  const isLoading = isOfLoading || isClientsLoading || isArticlesLoading;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Modifier l'Ordre de Fabrication</h2>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Form {...form}>
          <form 
            id="update-of-form" 
            onSubmit={form.handleSubmit((values) => updateOF(values))} 
            className="space-y-4"
          >
            <div className="space-y-4">
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
                        disabled={isLoading}
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Articles */}
              {[1, 2, 3, 4, 5].map((num) => (
                <FormField
                  key={num}
                  control={form.control}
                  name={`article${num}` }
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
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              ))}

              {/* OF Date */}
              <DatePickerField 
                control={form.control}
                name="ofDate"
                label="Date OF*"
                disabled={isLoading}
                maxDate={new Date()}
              />

              {/* Delivery Date */}
              <DatePickerField 
                control={form.control}
                name="deliveryDate"
                label="Date Prévue livraison*"
                disabled={isLoading}
                minDate={new Date()}
              />

              {/* Switches */}
              {SWITCH_FIELDS.map(({ name, label }) => (
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

      {/* Fixed footer */}
      <div className="p-4 border-t flex justify-end items-center gap-2">
        <div className="w-1/3 -m-0.5">
          <SheetCloseComponent/>
        </div>

        <Button 
          type="submit" 
          form="update-of-form" 
          disabled={isUpdating || isLoading}
          className="px-4 py-2 text-sm font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enregistrement...
            </span>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </div>
    </div>
  );
}

// Extracted DatePicker component for reuse
function DatePickerField({
  control,
  name,
  label,
  disabled,
  minDate,
  maxDate,
}) {
  const formatDateDisplay = (date) => {
    return format(date, 'dd/MM/yyyy', { locale: fr });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="font-medium">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal h-11",
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
              <div className="rounded-md border shadow-sm">
                <input
                  type="date"
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  value={field.value?.toISOString().split('T')[0] || ''}
                  className="p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  min={minDate?.toISOString().split('T')[0]}
                  max={maxDate?.toISOString().split('T')[0]}
                />
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}