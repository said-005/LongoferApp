"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
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

// API imports
import { ProductionApi } from "../../../Api/ProductionApi";
import { MachineApi } from "../../../Api/machineApi";
import { CausseApi } from "../../../Api/causseApi";
import { DefautApi } from "../../../Api/defautApi";
import { OperateurApi } from "../../../Api/operateurApi";
import { StatutApi } from "../../../Api/StatutApi";
import { MAX_DESCRIPTION_LENGTH } from "../Production/productionForm";
import SheetCloseComponent from "../../SheetClose";
import { PeintureExtApi } from "../../../Api/peinture_extApi";

const formSchema = z.object({
  ref_production: z.string().min(1, "La référence production est requise"),
  code_Peinture_Externe: z.string()
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

export default function UpdatePeintureExt({ id }) {
  const queryOptions = {
    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`),
  };

  // Fetch all required data in parallel
  const { 
    data: PeintureextData, 
    isLoading: isLoadingPeintureEXT 
  } = useQuery({
    queryKey: ['peinture_externe', id],
    queryFn: () => PeintureExtApi.getPeinture_extById(id),
    ...queryOptions
  });

  const { 
    data: productions = [], 
    isLoading: isLoadingProductions 
  } = useQuery({
    queryKey: ['productionsOptions'],
    queryFn: async () => {
      const response = await ProductionApi.getAll();
      const formatted = response.data.data.map((pro) => ({
        label: `${pro.production_code}`,
        value: pro.production_code
      }));
      return formatted;
    },
    ...queryOptions
  });

  const { 
    data: machines = [], 
    isLoading: isLoadingMachines 
  } = useQuery({
    queryKey: ['machinesOptions'],
    queryFn: async () => {
      const response = await MachineApi.getAll();
      return response.data.data.map(machine => ({
        label: `${machine.codeMachine} - ${machine.MachineName}`,
        value: machine.codeMachine
      }));
    },
    ...queryOptions
  });

  const { 
    data: statusOptions = [], 
    isLoading: isLoadingStatus 
  } = useQuery({
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

  const { data: defects = [], isLoading: isLoadingDefects } = useQuery({
    queryKey: ['defectsOptions'],
    queryFn: async () => {
      const res = await DefautApi.getAll();
      return res.data.data.map((defect) => ({
        label: `${defect.codeDefaut}-${defect.defautDescription.substring(0, 30)}${defect.defautDescription.length > 30 ? '...' : ''}`,
        value: defect.codeDefaut
      }));
    },
    ...queryOptions
  });

  const { 
    data: causes = [], 
    isLoading: isLoadingCauses 
  } = useQuery({
    queryKey: ['causesOptions'],
    queryFn: async () => {
      const response = await CausseApi.getAll();
      return response.data.data.map(cause => ({
        label: `${cause.code_causse}-${cause.causse.substring(0, 30)}${cause.causse.length > 30 ? '...' : ''}`,
        value: cause.code_causse
      }));
    },
    ...queryOptions
  });

  const normalizeString = (str) => 
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const { data: operateurs = { operators: [], welders: [], inspectors: [] }, isLoadingOperateurs } = useQuery({
    queryKey: ['operateursOptions'],
    queryFn: async () => {
      const response = await OperateurApi.getAll();
      const data = response.data.data;

      return {
        operators: data
          .filter(op => normalizeString(op.Fonction) === normalizeString('opérateur'))
          .sort((a, b) => a.nom_complete.localeCompare(b.nom_complete, 'fr'))
          .map(op => ({
            label: `${op.operateur} - ${op.nom_complete}`,
            value: op.operateur
          })),

        welders: data
          .filter(op => normalizeString(op.Fonction) === normalizeString('soudeur'))
          .sort((a, b) => a.nom_complete.localeCompare(b.nom_complete, 'fr'))
          .map(op => ({
            label: `${op.operateur} - ${op.nom_complete}`,
            value: op.operateur
          })),

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
      code_Peinture_Externe: '',
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

  // Reset form when reparation data is loaded
  useEffect(() => {
    if (PeintureextData?.data?.data) {
      const data = PeintureextData.data.data;
      form.reset({
        ref_production: data.ref_production  || '',
        code_Peinture_Externe: data.code_Peinture_Externe || '',
        date: data.date_Peinture_Externe ? new Date(data.date_Peinture_Externe) : undefined,
        machine: data.machine || '',
        status: data.statut || '',
        defect: data.defaut || '',
        cause: data.causse || '',
        operator: data.operateur || '',
        welder: data.soudeur || '',
        inspector: data.controleur || '',
        description: data.description || ''
      });
    }
  }, [PeintureextData, form]);
  
  const queryClinet = useQueryClient()
  const { mutate: updatePeintureEXT, isPending: isSubmitting } = useMutation({
    mutationFn: (Data) => 
      PeintureExtApi.updatePeinture_ext(id,Data),
    onSuccess: () => {
      toast.success("Peinture Externe mise à jour avec succès");
      queryClinet.invalidateQueries('reparations')
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour", {
        description: error.response?.data?.message || error.message,
      });
    }
  });

  const onSubmit = (values) => {
    const payload = {
      ref_production: values.ref_production,
      code_Peinture_Externe: values.code_Peinture_Externe,
      date_Peinture_Externe: format(values.date, "yyyy-MM-dd HH:mm:ss"),
      machine: values.machine,
      statut: values.status,
      defaut: values.defect || null,
      causse: values.cause || null,
      operateur: values.operator,
      soudeur: values.welder,
      controleur: values.inspector,
      description: values.description
    };
    
    updatePeintureEXT(payload);
  };

  const isLoadingData = isLoadingProductions || isLoadingMachines || 
                       isLoadingStatus || isLoadingDefects || isLoadingCauses || 
                       isLoadingOperateurs || isLoadingPeintureEXT;

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-foreground">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-background rounded-lg shadow-md mt-8 md:mt-12 border">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center text-foreground">
        Modifier la Réparation
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-2">
            {/* Production Reference */}
            <FormField
              control={form.control}
              name="ref_production"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence Production</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={productions}
                      text="Sélectionnez une production"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Repair Code */}
            <FormField
              control={form.control}
              name="code_Peinture_Externe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence Peiture Externe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez une Référence Peinture Externe"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-background",
                            !field.value && "text-muted-foreground"
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
                        className="bg-background"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Machine */}
            <FormField
              control={form.control}
              name="machine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={machines}
                      text="Sélectionnez une machine"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={statusOptions}
                      text="Sélectionnez un statut"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Defect */}
            <FormField
              control={form.control}
              name="defect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Défaut (optionnel)</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={defects}
                      text="Sélectionnez un défaut"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cause */}
            <FormField
              control={form.control}
              name="cause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cause (optionnel)</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={causes}
                      text="Sélectionnez une cause"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Operator */}
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opérateur</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={operateurs.operators}
                      text="Sélectionnez un opérateur"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Welder */}
            <FormField
              control={form.control}
              name="welder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soudeur</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={operateurs.welders}
                      text="Sélectionnez un soudeur"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Inspector */}
            <FormField
              control={form.control}
              name="inspector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contrôleur</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={operateurs.inspectors}
                      text="Sélectionnez un Contrôleur"
                      place="Choisissez parmi les suggestions"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
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
                <FormLabel>Description du tube</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Décrivez en détail le tube"
                      className="min-h-[120px] bg-background"
                      {...field}
                      value={field.value || ''}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {field.value?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t">
            <div className="w-1/3">
              <SheetCloseComponent variant="outline" className="w-full" />
            </div>
            <Button 
              type="submit"
              className="min-w-[120px] w-1/3" 
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