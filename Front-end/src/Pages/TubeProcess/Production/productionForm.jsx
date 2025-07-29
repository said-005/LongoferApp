"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
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
import { useNavigate } from "react-router-dom";
import { cn } from './../../../lib/utils';
import { ProductionApi } from "../../../Api/ProductionApi";



export const MAX_DESCRIPTION_LENGTH = 500;

const formSchema = z.object({
  refOF: z.string().min(1, "La référence OF est requise"),
  articleCode: z.string()
    .min(2, "Le code article doit contenir au moins 2 caractères"),
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
    .min(1, "La quantité doit être au moins 1"),
});

export default function ProductionForm() {
  const navigate = useNavigate();
  
  const queryOptions = {
    
    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`, {
      className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
    }),
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

  
const normalizeString = (str) => 
  str
    .normalize("NFD") // Decomposes accents (é → e + ´)
    .replace(/[\u0300-\u036f]/g, "") // Removes accent marks
    .toLowerCase(); // Converts to lowercase for case-insensitive comparison

const { data: operateurs = { operators: [], welders: [], inspectors: [] }, isLoadingOperateurs } = useQuery({
  queryKey: ['operateursOptions'],
  queryFn: async () => {
    const response = await OperateurApi.getAll();
    const data = response.data.data;

    return {
      // 1. Opérateurs (matches "opérateur", "operateur", "OPÉRATEUR", etc.)
      operators: data
        .filter(op => normalizeString(op.Fonction) === normalizeString('opérateur'))
        .sort((a, b) => a.nom_complete.localeCompare(b.nom_complete, 'fr'))
        .map(op => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        })),

      // 2. Soudeurs (matches "soudeur", "SOUDEUR", etc. - usually no accent)
      welders: data
        .filter(op => normalizeString(op.Fonction) === normalizeString('soudeur'))
        .sort((a, b) => a.nom_complete.localeCompare(b.nom_complete, 'fr'))
        .map(op => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        })),

      // 3. Contrôleurs (matches "controleur", "contrôleur", "CONTROLEUR", etc.)
      inspectors: data
        .filter(op => normalizeString(op.Fonction) === normalizeString('contrôleur'))
        .sort((a, b) => a.nom_complete.localeCompare(b.nom_complete, 'fr'))
        .map(op => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        }))
    };
  },
  ...queryOptions
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

  const isLoadingData = isLoadingOFs || isLoadingArticles || isLoadingMachines || 
                      isLoadingStatus || isLoadingDefects || isLoadingCauses || 
                      isLoadingOperateurs;

  const { mutate: submitProduction, isPending: isSubmitting } = useMutation({
    mutationFn: (productionData) => ProductionApi.createProduction(productionData),
    onSuccess: () => {
      toast.success("Production créée avec succès", {
        className: "bg-green-100 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800",
      });
      form.reset();
      navigate('/production');
    },
    onError: (error) => {
      toast.error("Erreur lors de la création", {
        description: error.response?.data?.message || error.message,
        className: "bg-red-100 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-800",
      });
    }
  });

  const onSubmit = (values) => {
    const dateObj = new Date(values.date);
    const pad = (num) => String(num).padStart(2, '0');
    const formattedDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    
    submitProduction({
      production_code: values.articleCode,
      Num_OF: values.refOF,
      ref_article: values.refArticle,
      date_production: formattedDate,
      qte_produite: values.qte_produite,
      machine: values.machine,
      statut: values.status,
      defaut: values.defect,
      causse: values.cause,
      operateur: values.operator,
      soudeur: values.welder,
      controleur: values.inspector,
      description: values.description,
    });
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 max-w-6xl mx-auto rounded-lg shadow-md mt-8",
      "bg-white dark:bg-gray-900",
      "border border-gray-200 dark:border-gray-800"
    )}>
      <h1 className={cn(
        "text-2xl font-bold mb-8 text-center",
        "text-gray-800 dark:text-gray-100"
      )}>
        Formulaire de Production
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      text="Sélectionnez un  article"
                      place="Choisissez parmi les suggestions"
                      value={field.value || ''}
                      onChange={(value) => field.onChange(value || '')}
                      required
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Article Code */}
            <FormField
              control={form.control}
              name="articleCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Référence Production</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrer une Référence Production"
                      {...field}
                      value={field.value || ''}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700 dark:text-gray-300">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                            "dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
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
                        initialFocus
                        className="dark:bg-gray-800 dark:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Quantity Produced */}
            <FormField
              control={form.control}
              name="qte_produite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Quantité Produite*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="Entrez la quantité produite"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
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
                <FormLabel className="text-gray-700 dark:text-gray-300">Description du tube</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Décrivez en détail le tube"
                      className={cn(
                        "min-h-[120px]",
                        "dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      )}
                      {...field}
                      value={field.value || ''}
                    />
                    <div className={cn(
                      "absolute bottom-2 right-2 text-xs",
                      "text-muted-foreground dark:text-gray-400"
                    )}>
                      {field.value?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <div className={cn(
            "flex justify-center gap-4 mt-8 pt-4 border-t",
            "border-gray-200 dark:border-gray-800"
          )}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/production')}
              className={cn(
                "min-w-[120px]",
                "border-gray-300 hover:bg-gray-100",
                "dark:border-gray-700 dark:hover:bg-gray-800",
                "text-gray-800 dark:text-gray-200"
              )}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className={cn(
                "min-w-[120px]",
                "bg-blue-600 hover:bg-blue-700",
                "dark:bg-blue-700 dark:hover:bg-blue-800",
                "text-white dark:text-gray-100"
              )} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}