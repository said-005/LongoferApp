"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";

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
import { cn } from '../../../lib/utils';
import SheetCloseComponent from "../../SheetClose";

// API imports
import { ProductionApi } from "../../../Api/ProductionApi";
import { MachineApi } from "../../../Api/machineApi";
import { CausseApi } from "../../../Api/causseApi";
import { DefautApi } from "../../../Api/defautApi";
import { OperateurApi } from "../../../Api/operateurApi";
import { StatutApi } from "../../../Api/StatutApi";
import { ManchetteApi } from "../../../Api/Manchette";

const formSchema = z.object({
  ref_production: z.string().min(1, "La référence production est requise"),
  code_manchette: z.string()
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

export default function UpdateManchette({ id }) {
  const queryClient = useQueryClient();
  
  const queryOptions = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`),
  };

  // Fetch all required data
  const { 
    data: manchetteData, 
    isLoading: isLoadingManchette,
    isError: isManchetteError
  } = useQuery({
    queryKey: ['manchette', id],
    queryFn: () => ManchetteApi.getManchetteById(id),
    ...queryOptions
  });

  const { data: productions = [] } = useQuery({
    queryKey: ['productions'],
    queryFn: async () => {const response = await ProductionApi.getAll();
const formatted = response.data.data.map((pro) => ({
  label: `${pro.production_code}`,
  value: pro.production_code
}));
console.log(formatted);  // ✅ This will show you the final array
return formatted;
    },
    ...queryOptions
  });

  const { data: machines = [] } = useQuery({
    queryKey: ['machines'],
    queryFn: async () => {
      const response = await MachineApi.getAll();
      return response.data.data.map(machine => ({
        label: `${machine.codeMachine} - ${machine.MachineName}`,
        value: machine.codeMachine
      }));
    },
    ...queryOptions
  });

  const { data: statusOptions = [] } = useQuery({
    queryKey: ['statusOptions'],
    queryFn: async () => {
      const response = await StatutApi.getAll();
      return response.data.data.map(status => ({
        label: status.Statut,
        value: status.Statut
      }));
    },
    ...queryOptions
  });

  const { data: defects = [] } = useQuery({
    queryKey: ['defects'],
    queryFn: async () => {
      const res = await DefautApi.getAll();
      return res.data.data.map(defect => ({
        label: defect.codeDefaut,
        value: defect.codeDefaut
      }));
    },
    ...queryOptions
  });

  const { data: causes = [] } = useQuery({
    queryKey: ['causes'],
    queryFn: async () => {
      const response = await CausseApi.getAll();
      return response.data.data.map(cause => ({
        label: cause.code_causse,
        value: cause.code_causse
      }));
    },
    ...queryOptions
  });

  const { data: operateurs = { operators: [], welders: [], inspectors: [] } } = useQuery({
    queryKey: ['operateurs'],
    queryFn: async () => {
      const response = await OperateurApi.getAll();
      const data = response.data.data;
      return {
        operators: data.map(op => ({
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
      code_manchette: '',
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

  // Reset form when manchette data is loaded
  useEffect(() => {
    if (manchetteData?.data?.data) {
      const data = manchetteData.data.data;
      form.reset({
        ref_production: data.ref_production || '',
        code_manchette: data.code_Manchette || '',
        date: data.date_Manchette ? parseISO(data.date_Manchette) : undefined,
        machine: data.machine || '',
        status: data.statut || '',
        defect: data.defaut || '',
        cause: data.causse || '',
        operator: data.operateur || '',
        welder: data.soudeur || '',
        inspector: data.controleur || '',
      });
    }
  }, [manchetteData, form]);

  const { mutate: updateManchette, isPending: isSubmitting } = useMutation({
    mutationFn: (data) => ManchetteApi.updateManchette(id, data),
    onSuccess: () => {
      toast.success("Manchette mise à jour avec succès");
      queryClient.invalidateQueries(['manchette', id]);
      queryClient.invalidateQueries('manchettes');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message;
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
    }
  });

  const onSubmit = (values) => {
    const payload = {
      ref_production: values.ref_production,
      code_Manchette: values.code_manchette,
      date_Manchette: format(values.date, "yyyy-MM-dd") + " 00:00:00",
      machine: values.machine,
      statut: values.status,
      defaut: values.defect || null,
      causse: values.cause || null,
      operateur: values.operator,
      soudeur: values.welder,
      controleur: values.inspector,
    };
    
    updateManchette(payload);
  };
if (isLoadingManchette) {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-gray-800 dark:text-gray-200" />
      <span className="ml-2 text-gray-800 dark:text-gray-200">Chargement des données...</span>
    </div>
  );
}

if (isManchetteError) {
  return (
    <div className="flex justify-center items-center h-64">
      <span className="text-red-500 dark:text-red-400">Erreur lors du chargement de la manchette</span>
    </div>
  );
}

return (
  <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800 mt-8 md:mt-12">
    <h1 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
      Modifier la Manchette
    </h1>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-3">
          {/* Production Reference */}
          <FormField
            control={form.control}
            name="ref_production"
            render={({ field }) => (
              <FormItem>
               
                <FormControl>
                  <AutocompleteInput
                    data={productions}
                    text="Sélectionnez une référence"
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

          {/* Manchette Code */}
          <FormField
            control={form.control}
            name="code_manchette"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-gray-300">Code Manchette</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez le code manchette"
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
                <FormLabel className="text-gray-800 dark:text-gray-300">Date</FormLabel>
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

        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t dark:border-gray-700">
          <div className="w-1/3">
            <SheetCloseComponent className="dark:text-gray-300" />
          </div>
          <Button 
            type="submit"
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin dark:text-white" />
                Enregistrement...
              </>
            ) : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Form>
  </div>
)};