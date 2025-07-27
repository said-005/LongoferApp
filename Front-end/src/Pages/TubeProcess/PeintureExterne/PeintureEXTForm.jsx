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
import { PeintureExtApi } from "../../../Api/peinture_extApi";

// API imports
import { ProductionApi } from "../../../Api/ProductionApi";
import { MachineApi } from "../../../Api/machineApi";
import { CausseApi } from "../../../Api/causseApi";
import { DefautApi } from "../../../Api/defautApi";
import { OperateurApi } from "../../../Api/operateurApi";
import { StatutApi } from "../../../Api/StatutApi";

const formSchema = z.object({
  ref_production: z.string().min(1, "La référence production est requise"),
  code_Peinture_Externe: z.string()
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
});

export default function PeintureEXTForm() {
  const navigate = useNavigate();
  
  const queryOptions = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`),
  };

  // Fetch all required data
  const { data: productions = [], isLoading: isLoadingProductions } = useQuery({
    queryKey: ['productions'],
    queryFn: async () => {
      const response = await ProductionApi.getAll();
      return response.data.data.map((pro) => ({
        label: pro.production_code,
        value: pro.production_code
      }));
    },
    ...queryOptions
  });

  const { data: machines = [], isLoading: isLoadingMachines } = useQuery({
    queryKey: ['machines'],
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
    queryKey: ['defects'],
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
    queryKey: ['causes'],
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
    queryKey: ['operateurs'],
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ref_production: '',
      code_Peinture_Externe: '',
      date: undefined,
      machine: '',
      status: '',
      defect: '',
      cause: '',
      operator: '',
      welder: '',
      inspector: '',
    },
    mode: 'onBlur',
  });

  const isLoadingData = isLoadingProductions || isLoadingMachines || 
                      isLoadingStatus || isLoadingDefects || isLoadingCauses || 
                      isLoadingOperateurs;

  const { mutate: createPeintureEXT, isPending: isSubmitting } = useMutation({
    mutationFn: (data) => PeintureExtApi.createPeinture_ext(data),
    onSuccess: () => {
      toast.success("Peinture externe créée avec succès");
      form.reset();
      navigate('/peinture_ext');
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
      code_Peinture_Externe: values.code_Peinture_Externe,
      date_Peinture_Externe: format(values.date, "yyyy-MM-dd") + " 00:00:00",
      machine: values.machine,
      statut: values.status,
      defaut: values.defect || null,
      causse: values.cause || null,
      operateur: values.operator,
      soudeur: values.welder,
      controleur: values.inspector,
    };
    
    createPeintureEXT(payload);
  };
if (isLoadingData) {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <span className="ml-2 text-gray-800 dark:text-blue-100">Chargement des données...</span>
    </div>
  );
}

return (
  <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800/50 mt-8">
    <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-blue-100">Formulaire de Peinture Externe</h1>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Production Reference */}
          <FormField
            control={form.control}
            name="ref_production"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-blue-100">Référence Production</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={productions}
                    text="Sélectionnez une référence production"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
                    required
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
              </FormItem>
            )}
          />

          {/* Peinture Externe Code */}
          <FormField
            control={form.control}
            name="code_Peinture_Externe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-blue-100">Code Peinture Externe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez le code peinture externe"
                    {...field}
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
                <FormLabel className="dark:text-blue-100">Machine</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={machines}
                    text="Sélectionnez une machine"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
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
                <FormLabel className="dark:text-blue-100">Statut</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={statusOptions}
                    text="Sélectionnez un statut"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
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
                <FormLabel className="dark:text-blue-100">Défaut (optionnel)</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={defects}
                    text="Sélectionnez un défaut"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
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
                <FormLabel className="dark:text-blue-100">Cause (optionnel)</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={causes}
                    text="Sélectionnez une cause"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
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
                <FormLabel className="dark:text-blue-100">Opérateur</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={operateurs.operators}
                    text="Sélectionnez un opérateur"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
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
                <FormLabel className="dark:text-blue-100">Soudeur</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={operateurs.welders}
                    text="Sélectionnez un soudeur"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
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
                <FormLabel className="dark:text-blue-100">Inspecteur</FormLabel>
                <FormControl>
                  <AutocompleteInput
                    data={operateurs.inspectors}
                    text="Sélectionnez un inspecteur"
                    place="Choisissez parmi les suggestions"
                    value={field.value}
                    onChange={field.onChange}
                    required
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-blue-100 dark:placeholder:text-blue-200/50"
                  />
                </FormControl>
                <FormMessage className="dark:text-blue-300" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center gap-4 mt-8 pt-4 border-t dark:border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/peinture_ext')}
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