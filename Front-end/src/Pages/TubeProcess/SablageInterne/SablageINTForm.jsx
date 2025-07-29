"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from '../../../lib/utils';

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
import AutocompleteInput from "../../../AutoComplet/AutoCompletInput";
import { Textarea } from "@/components/ui/textarea";
import { OperateurApi } from "../../../Api/operateurApi";
import { CausseApi } from "../../../Api/causseApi";
import { DefautApi } from "../../../Api/defautApi";
import { StatutApi } from "../../../Api/StatutApi";
import { MachineApi } from "../../../Api/machineApi";
import { ProductionApi } from "../../../Api/ProductionApi";
import { SablageIntApi } from "../../../Api/SablageIntApi";

import { MAX_DESCRIPTION_LENGTH } from "../Production/productionForm";

const formSchema = z.object({
  ref_production: z.string().min(1, "La référence production est requise"),
  code_Sablage_Interne: z.string()
    .min(2, "Le code doit contenir au moins 2 caractères"),
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
});

export default function SablageINTForm() {
  const navigate = useNavigate();
  
  const queryOptions = {

    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`),
  };

  // Fetch all required data
  const { data: productions = [], isLoading: isLoadingProductions } = useQuery({
    queryKey: ['productionsOptions'],
    queryFn: async () => {
      const response = await ProductionApi.getAll();
      const formedData= response.data.data.map((pro) => ({
        label: pro.production_code,
        value: pro.production_code
      }));
    return formedData
    },
    ...queryOptions
  });
console.log(productions)
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
      label: `${defect.codeDefaut}-${defect.defautDescription.substring(0, 30)}${defect.defautDescription.length > 30 ? '...' : ''}`, // Shows first 30 chars + ellipsis if longer
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
         label: `${cause.code_causse}-${cause.causse.substring(0, 30)}${cause.causse.length > 30 ? '...' : ''}`,
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
      ref_production: '',
      code_Sablage_Interne: '',
      date: undefined,
      machine: '',
      status: '',
      defect: '',
      cause: '',
      operator: '',
      welder: '',
      inspector: '',
      description:''
    },
    mode: 'onBlur',
  });

  const isLoadingData = isLoadingProductions || isLoadingMachines || 
                      isLoadingStatus || isLoadingDefects || isLoadingCauses || 
                      isLoadingOperateurs;

  const { mutate: createSablageINT, isPending: isSubmitting } = useMutation({
    mutationFn: (data) => SablageIntApi.createSablage_int(data),
    onSuccess: () => {
      toast.success("Sablage interne créé avec succès");
      form.reset();
      navigate('/sablage_int');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message;
      toast.error(`Erreur lors de la création: ${errorMessage}`);
    }
  });

  const onSubmit = (values) => {
    const payload = {
      ref_production: values.ref_production,
      code_Sablage_Interne: values.code_Sablage_Interne,
      date_Sablage_Interne: format(values.date, "yyyy-MM-dd") + " 00:00:00",
      machine: values.machine,
      statut: values.status,
      defaut: values.defect || null,
      causse: values.cause || null,
      operateur: values.operator,
      soudeur: values.welder,
      controleur: values.inspector,
      description: values.description
    };
    console.log(payload)
    
    createSablageINT(payload);
  };
if (isLoadingData) {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-gray-800 dark:text-gray-200" />
      <span className="ml-2 text-gray-800 dark:text-gray-200">Chargement des données...</span>
    </div>
  );
}

return (
  <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800 mt-8">
    <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
      Formulaire de Sablage Interne
    </h1>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Production Reference */}
          <FormField
            control={form.control}
            name="ref_production"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AutocompleteInput
                    data={productions}
                    text="Sélectionnez une  production"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
                    required
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Sablage Interne Code */}
          <FormField
            control={form.control}
            name="code_Sablage_Interne"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300">Référence Sablage Interne</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez une Référence de sablage interne"
                    {...field}
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
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 dark:text-gray-300" />
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
                    value={field.value}
                    onChange={field.onChange}
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
                    value={field.value}
                    onChange={field.onChange}
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
                    value={field.value}
                    onChange={field.onChange}
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
                    value={field.value}
                    onChange={field.onChange}
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
                    value={field.value}
                    onChange={field.onChange}
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
                    value={field.value}
                    onChange={field.onChange}
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
                    value={field.value}
                    onChange={field.onChange}
                    required
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

        <div className="flex justify-center gap-4 mt-8 pt-4 border-t dark:border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/sablage_int')}
            className="min-w-[120px] dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" 
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
)};