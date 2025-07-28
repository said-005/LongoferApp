import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OfApi } from "../../../Api/ofApi";
import { ArticleApi } from "../../../Api/ArticleApi";
import { MachineApi } from "../../../Api/machineApi";
import { CausseApi } from "../../../Api/causseApi";
import { DefautApi } from "../../../Api/defautApi";
import { OperateurApi } from "../../../Api/operateurApi";
import { StatutApi } from "../../../Api/StatutApi";
import AutocompleteInput from "../../../AutoComplet/AutoCompletInput";

import { cn } from './../../../lib/utils';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProductionApi } from "../../../Api/ProductionApi";
import { useEffect } from "react";
import { Calendar1Icon, Loader2 } from "lucide-react";
import SheetCloseComponent from './../../SheetClose';


const MAX_DESCRIPTION_LENGTH = 500;

const formSchema = z.object({
  refOF: z.string().min(1, "La référence OF est requise"),
  articleCode: z.string()
    .min(2, "Le code article doit contenir au moins 2 caractères")
    .max(50, "Le code article est trop long"),
  refArticle: z.string().min(1, "La référence article est requise"),
  date: z.date({
    required_error: "La date est requise",
    invalid_type_error: "Format de date invalide",
  }),
  machine: z.string().min(1, "La machine est requise"),
  status: z.string().min(1, "Le statut est requis"),
  defect: z.string().optional(),
  cause: z.string().optional(),
  operator: z.string().min(1, "L'opérateur est requis"),
  welder: z.string().min(1, "Le soudeur est requis"),
  inspector: z.string().min(1, "L'inspecteur est requis"),
  description: z.string()
    .max(MAX_DESCRIPTION_LENGTH, `La description ne doit pas dépasser ${MAX_DESCRIPTION_LENGTH} caractères`)
    .optional(),
      qte_produite: z.number()
        .min(1, "La quantité doit être au moins 1")
        .max(10000, "La quantité ne peut pas dépasser 10000"),
});

export default function UpdateProduction({id}) {

  const queryOptions = {
    staleTime: 1000 * 60 * 5,
    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`),
  };
  

  // Fetch data queries
  const { data: refOFs = [], isLoading: isLoadingOFs } = useQuery({
    queryKey: ['refOFsOptions'],
    queryFn: async () => {
      const response = await OfApi.getAll();
      return response.data.data.map((of) => ({
        label: of.codeOf,
        value: of.codeOf
      }));
    },
    ...queryOptions
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articlesOptions'],
    queryFn: async () => {
      const response = await ArticleApi.getAll();
      return response.data.data.map((article) => ({
        label: `${article.codeArticle} - ${article.ArticleName}`,
        value: article.codeArticle
      }));
    },
    ...queryOptions
  });

  const { data: machines = [], isLoading: isLoadingMachines } = useQuery({
    queryKey: ['machinesOptions'],
    queryFn: async () => {
      const response = await MachineApi.getAll();
      return response.data.data.map((machine) => ({
        label: `${machine.codeMachine} - ${machine.MachineName}`,
        value: machine.codeMachine
      }));
    },
    ...queryOptions
  });

  const { data: statusOptions = [], isLoading: isLoadingStatus } = useQuery({
    queryKey: ['statusOptions'],
    queryFn: async () => {
      const response = await StatutApi.getAll();
      return response.data.data.map((status) => ({
        label: status.Statut,
        value: status.Statut
      }));
    },
    ...queryOptions
  });

  const { data: defects = [], isLoading: isLoadingDefects } = useQuery({
    queryKey: ['defectsOptions'],
    queryFn: async () => {
      const res = await DefautApi.getAll();
      return res.data.data.map((defect) => ({
        label: defect.codeDefaut,
        value: defect.codeDefaut
      }));
    },
    ...queryOptions
  });

  const { data: causes = [], isLoading: isLoadingCauses } = useQuery({
    queryKey: ['causesOptions'],
    queryFn: async () => {
      const response = await CausseApi.getAll();
      return response.data.data.map((cause) => ({
        label: cause.code_causse,
        value: cause.code_causse
      }));
    },
    ...queryOptions
  });

  const { data: operateurs = { operators: [], welders: [], inspectors: [] }, isLoading: isLoadingOperateurs } = useQuery({
    queryKey: ['operateursOptions'],
    queryFn: async () => {
      const response = await OperateurApi.getAll();
      const data = response.data.data;
      return {
        operators: data.map((op) => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        })),
        welders: data.filter(op => op.Fonction === 'soudeur').map(op => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        })),
        inspectors: data.filter(op => op.Fonction === 'inspecteur').map(op => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        }))
      };
    },
    ...queryOptions
  });
// get data for Production

const { data: productionData, isLoading: isLoadingProduction } = useQuery({
    queryKey: ['production', id],
    queryFn: async () => {
      if (!id) return null;  // Skip if no ID (create mode)
      const response = await ProductionApi.getProductionById(id);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    onError: (error) => toast.error(`Erreur de chargement des données de production: ${error.message}`),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      refOF: '',
      articleCode: '',
      refArticle: '',
      date: undefined,
      qte_produite: 1,
      machine: '',
      status: '',
      defect: '',
      cause: '',
      operator: '',
      welder: '',
      inspector: '',
      description: ''
    },
    mode: 'onBlur',
  });
// Populate form when productionData is loaded
  useEffect(() => {
    if (productionData) {
      form.reset({
        refOF: productionData.Num_OF  || '',
        articleCode: productionData.production_code  || '',
        refArticle: productionData.ref_article  || '',
        date: productionData.date_production ? new Date(productionData.date_production) : undefined,
        machine: productionData.machine || '',
        status: productionData.statut  || '',
        defect: productionData.defaut  || '',
        cause: productionData.causse || '',
        operator: productionData.operateur  || '',
        welder: productionData.soudeur  || '',
        inspector: productionData.controleur  || '',
        description: productionData.description || ''
      });
    }
    
  }, [productionData, form]);
const isLoadingData = isLoadingOFs || isLoadingArticles || isLoadingMachines || 
                      isLoadingStatus || isLoadingDefects || isLoadingCauses || 
                      isLoadingOperateurs || isLoadingProduction;
 //send data
 const queryClient=useQueryClient()
   const { mutate: updateProduction } = useMutation({
    mutationFn: (updatedData) => ProductionApi.updateProduction(id, updatedData),
    onSuccess: () => {
      toast.success("Production mise à jour avec succès");
      queryClient.invalidateQueries('productions')
    },
    onError: (error) => {
      toast.error("Échec de la mise à jour", {
        description: error.response.data.message,
      });
    }
  });
const onSubmit = (values) => {
   const dateObj = new Date(values.date);

  const pad = (num) => String(num).padStart(2, '0');

  const formattedDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;

  updateProduction({
     production_code:values.articleCode,          // Map refOF to production_code
    Num_OF: values.refOF,                  // Same as production_code if needed
    ref_article: values.refArticle,        // Map refArticle to ref_article
    date_production: formattedDate,          // Map date to date_production
    qte_produite: values.qte_produite,                      // Add quantity produced (default 0)
    machine: values.machine,               // Same field name
    statut: values.status,                 // Map status to statut
    defaut: values.defect,                 // Map defect to defaut
    causse: values.cause,                  // Map cause to causse
    operateur: values.operator,            // Map operator to operateur
    soudeur: values.welder,                // Map welder to soudeur
    controleur: values.inspector,          // Map inspector to controleur
    description: values.description,       // Keep if still needed
  });
};
  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800 mt-30">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
        Formulaire de Production
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            {/* Reference OF */}
            <FormField
              control={form.control}
              name="refOF"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={refOFs}
                      text="Sélectionnez une référence OF"
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

            {/* Reference Article */}
            <FormField
              control={form.control}
              name="refArticle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={articles}
                      text="Sélectionnez un reference article"
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

            {/* Article Code */}
            <FormField
              control={form.control}
              name="articleCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">Code Article</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrer un code article"
                      {...field}
                      value={field.value || ''}
                      className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="dark:text-gray-300">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal dark:bg-gray-800 dark:text-white dark:border-gray-700",
                            !field.value && "text-muted-foreground dark:text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <Calendar1Icon className="ml-auto h-4 w-4 opacity-50 dark:text-gray-300" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="dark:bg-gray-800"
                        classNames={{
                          day: "dark:text-white hover:dark:bg-gray-700",
                          day_selected: "dark:bg-blue-600 dark:text-white",
                          day_today: "dark:bg-gray-700 dark:text-white",
                          head_cell: "dark:text-gray-400",
                          caption: "dark:text-white",
                          nav_button: "dark:text-white dark:border-gray-600",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Machine */}
            <FormField
              control={form.control}
              name="machine"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={machines}
                      text="Sélectionnez une machine"
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

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={statusOptions}
                      text="Sélectionnez un statut"
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

            {/* Defect */}
            <FormField
              control={form.control}
              name="defect"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={defects}
                      text="Sélectionnez un défaut"
                      place="Choisissez parmi les suggestions"
                      value={field.value || ''}
                      onChange={(value) => field.onChange(value || '')}
                      className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Cause */}
            <FormField
              control={form.control}
              name="cause"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={causes}
                      text="Sélectionnez une cause"
                      place="Choisissez parmi les suggestions"
                      value={field.value || ''}
                      onChange={(value) => field.onChange(value || '')}
                      className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Operator */}
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={operateurs.operators}
                      text="Sélectionnez un opérateur"
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

            {/* Welder */}
            <FormField
              control={form.control}
              name="welder"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={operateurs.welders}
                      text="Sélectionnez un soudeur"
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

            {/* Inspector */}
            <FormField
              control={form.control}
              name="inspector"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutocompleteInput
                      data={operateurs.inspectors}
                      text="Sélectionnez un inspecteur"
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

            {/* Quantity Produced */}
            <FormField
              control={form.control}
              name="qte_produite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">Quantité Produite</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="Entrez la quantité produite"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Description du tube</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Décrivez en détail le tube"
                      className="min-h-[120px] dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      {...field}
                      value={field.value || ''}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground dark:text-gray-400">
                      {field.value?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="dark:text-red-400" />
              </FormItem>
            )}
          />

          <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t dark:border-gray-700">
            <div className="w-1/3">
              <SheetCloseComponent className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700" />
            </div>
            <Button 
              type="submit"
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  updating...
                </>
              ) : 'update'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}