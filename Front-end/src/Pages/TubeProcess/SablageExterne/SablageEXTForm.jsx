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
import { ProductionApi } from "../../../Api/ProductionApi";
import { MachineApi } from "../../../Api/machineApi";
import { CausseApi } from "../../../Api/causseApi";
import { DefautApi } from "../../../Api/defautApi";
import { OperateurApi } from "../../../Api/operateurApi";
import { StatutApi } from "../../../Api/StatutApi";
import AutocompleteInput from "../../../AutoComplet/AutoCompletInput";
import { useNavigate } from "react-router-dom";
import { cn } from '../../../lib/utils';

import { SablageEXTApi } from './../../../Api/Sablage_Ext';

import { MAX_DESCRIPTION_LENGTH } from "../Production/productionForm";



const formSchema = z.object({
  ref_production: z.string().min(1, "La référence production est requise"),
  code_sablage_externe: z.string()
    .min(1, "Le code réparation est requis")
    .min(2, "Le code doit contenir au moins 2 caractères")
    .max(50, "Le code est trop long"),
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



export default function SablageEXTForm() {
  const navigate = useNavigate();
  
  const queryOptions = {
    staleTime: 1000 * 60 * 5,
    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`),
  };

  // Fetch production references
  const { data: productions = [], isLoading: isLoadingProductions } = useQuery({
    queryKey: ['productionsOptions'],
    queryFn: async () => {
      const response = await ProductionApi.getAll();
const formatted = response.data.data.map((pro) => ({
  label: `${pro.production_code}`,
  value: pro.production_code
}));
console.log(formatted); 
return formatted;
    },
    ...queryOptions
  });

  // Fetch other data
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
    queryKey: ['statusOptionsOptions'],
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
        operators:data.filter(op => op.Fonction === 'operateur').map(op => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        })),
        welders: data.filter(op => op.Fonction === 'soudeur').map(op => ({
          label: `${op.operateur} - ${op.nom_complete}`,
          value: op.operateur
        })),
        inspectors: data.filter(op => op.Fonction === 'controleur').map(op => ({
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
      code_sablage_externe: '',
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

  // Mutation for creating reparation
  const { mutate: createSablageExt, isPending: isSubmitting } = useMutation({
    mutationFn: (Data) => 
      SablageEXTApi.createSablage_extt(Data),
    onSuccess: () => {
      toast.success("Sablage Ext créée avec succès");
      form.reset();
      navigate('/sablage_ext');
    },
    onError: (error) => {
      toast.error("Erreur lors de la création", {
        description: error.response?.data?.message || error.message,
      });
    }
  });


  const onSubmit = (values) => {
   
    const payload = {
      code_Sablage_Externe : values.code_sablage_externe,
      ref_production  : values.ref_production ,
      date_Sablage_Externe: format(values.date, "yyyy-MM-dd HH:mm:ss"),
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
    createSablageExt(payload);
  };
if (isLoadingData) {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <span className="ml-2 text-gray-800 dark:text-gray-200">Chargement des données...</span>
    </div>
  );
}
console.log(productions)
return (
  <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800/50 mt-30">
    <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-blue-100">Formulaire de Réparation</h1>
    
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
                    text="Sélectionnez une référence production"
                    place="Choisissez parmi les suggestions"
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value || '')}
                    required
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
              </FormItem>
            )}
          />

          {/* Repair Code */}
          <FormField
            control={form.control}
            name="code_sablage_externe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-blue-100">Code Sablage Externe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez le code de sablage externe"
                    {...field}
                    value={field.value || ''}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="dark:text-blue-100">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          "dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:hover:bg-gray-700",
                          !field.value && "text-muted-foreground dark:text-blue-200/70"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 dark:text-blue-300" />
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
                        day_selected: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
                        day_today: "border-blue-500 dark:border-blue-400",
                        day_disabled: "text-gray-400 dark:text-gray-500",
                        day_range_middle: "bg-blue-100 dark:bg-blue-900/50",
                        head_cell: "text-gray-800 dark:text-blue-200",
                        cell: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
                        button: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="dark:text-blue-300" />
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
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
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
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
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
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
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
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
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
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
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
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
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
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
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
            onClick={() => navigate('/sablage_ext')}
            className="min-w-[120px] dark:border-gray-600 dark:text-blue-100 dark:hover:bg-gray-800 dark:hover:text-blue-300"
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-blue-50" 
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