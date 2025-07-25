"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// API imports
import { ProductionApi } from "../../../Api/ProductionApi";
import { MachineApi } from "../../../Api/machineApi";
import { CausseApi } from "../../../Api/causseApi";
import { DefautApi } from "../../../Api/defautApi";
import { OperateurApi } from "../../../Api/operateurApi";
import { StatutApi } from "../../../Api/StatutApi";
import { SablageIntApi } from './../../../Api/SablageIntApi';
import SheetCloseComponent from "../../SheetClose";

// Schema moved to separate file for better organization
const formSchema = z.object({
  ref_production: z.string().min(1, "La référence production est requise"),
  code_Sablage_Interne: z.string()
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

export default function UpdateSablageInt({ id }) {
  const queryClient = useQueryClient();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const queryOptions = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => toast.error(`Erreur de chargement: ${error.message}`),
  };

  // Custom hook for fetching all required data
  const useFetchAllData = () => {
    const { data: reparationData, isLoading: isLoadingReparation } = useQuery({
      queryKey: ['sablage-interne', id],
      queryFn: () => SablageIntApi.getSablage_intById(id),
      ...queryOptions
    });

    const { data: productions = [], isLoading: isLoadingProductions } = useQuery({
      queryKey: ['productions'],
      queryFn: async () => {
        const response = await ProductionApi.getAll();
        return response.data.data.map(pro => ({
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
        return response.data.data.map(machine => ({
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
        return response.data.data.map(status => ({
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
        return res.data.data.map(defect => ({
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
        return response.data.data.map(cause => ({
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

    return {
      reparationData,
      productions,
      machines,
      statusOptions,
      defects,
      causes,
      operateurs,
      isLoading: isLoadingReparation || isLoadingProductions || isLoadingMachines || 
                isLoadingStatus || isLoadingDefects || isLoadingCauses || 
                isLoadingOperateurs
    };
  };

  const {
    reparationData,
    productions,
    machines,
    statusOptions,
    defects,
    causes,
    operateurs,
    isLoading
  } = useFetchAllData();

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
    },
    mode: 'onBlur',
  });

  // Reset form when reparation data is loaded
  useEffect(() => {
    if (reparationData?.data?.data) {
      const data = reparationData.data.data;
      form.reset({
        ref_production: data.ref_production || '',
        code_Sablage_Interne: data.code_Sablage_Interne || '',
        date: data.date_Sablage_Interne ? new Date(data.date_Sablage_Interne) : undefined,
        machine: data.machine || '',
        status: data.statut || '',
        defect: data.defaut || '',
        cause: data.causse || '',
        operator: data.operateur || '',
        welder: data.soudeur || '',
        inspector: data.controleur || '',
      });
    }
  }, [reparationData, form]);

  const { mutate: updateSablageInt, isPending: isSubmitting } = useMutation({
    mutationFn: (sablageData) => 
      SablageIntApi.updateSablage_int(id, sablageData),
    onSuccess: () => {
      toast.success("Sablage interne mis à jour avec succès");
      queryClient.invalidateQueries(['sablage-interne', id]);
      queryClient.invalidateQueries('sablage-interne');
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour", {
        description: error.response?.data?.message || error.message,
      });
    }
  });

  const handleSubmit = (values) => {
    setFormData(values);
    setShowConfirmation(true);
  };

  const confirmUpdate = () => {
    const payload = {
      code_Sablage_Interne: formData.code_Sablage_Interne,
      ref_production: formData.ref_production,
      date_Sablage_Interne: format(formData.date, "yyyy-MM-dd HH:mm:ss"),
      machine: formData.machine,
      statut: formData.status,
      defaut: formData.defect || null,
      causse: formData.cause || null,
      operateur: formData.operator,
      soudeur: formData.welder,
      controleur: formData.inspector,
    };
    
    updateSablageInt(payload);
    setShowConfirmation(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md mt-8 md:mt-12 space-y-4">
        <Skeleton className="h-8 w-1/3 mx-auto" />
        <div className="space-y-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md mt-8 md:mt-12">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800">
        Modifier le Sablage Interne
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-3">
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
                      text="Sélectionnez une référence"
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

            {/* Sablage Code */}
            <FormField
              control={form.control}
              name="code_Sablage_Interne"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Sablage Interne</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez le code sablage"
                      {...field}
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
                            "w-full pl-3 text-left font-normal",
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
                        disabled={(date) => date > new Date()}
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
                  <FormLabel>Inspecteur</FormLabel>
                  <FormControl>
                    <AutocompleteInput
                      data={operateurs.inspectors}
                      text="Sélectionnez un inspecteur"
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

          <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t">
            <div className="w-1/3">
              <SheetCloseComponent/>
            </div>
            <Button 
              type="submit"
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700" 
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la modification</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir modifier cet enregistrement de sablage interne ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}