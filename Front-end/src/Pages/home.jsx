import { useQueries, useQuery, useMutation } from "@tanstack/react-query";
import React, { useMemo, useCallback, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileSpreadsheet,CalendarIcon  } from "lucide-react";
import { ClientApi } from './../Api/ClientApi';
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cardConfig } from "./cartConfig";
import { customAxios } from "../Axios/axiosApi";
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const AutocompleteInput = lazy(() => import('./../AutoComplet/AutoCompletInput'));

const formSchema = z.object({
  client: z.string().min(1, "Client is required"),
  from: z.date(),
  to: z.date(),
});

const DashboardCard = React.memo(({ config, data, isLoading }) => {
  const Icon = config.icon;
  
  const getRoutePath = useCallback((key) => {
    const routeMap = {
      clients: '/client',
      articles: '/article',
      machines: '/machine',
      operateurs: '/operateur',
      production: '/production',
      ofs: '/of',
      defauts: '/defaut',
      tube_hs: '/tubeHS',
      statuts: '/statut',
      causses: '/causse',
      reparations: '/reparation',
      categories: '/categorie',
      manchettes: '/manchette',
      sablage_internes: '/sablage_int',
      sablage_externes: '/sablage_ext',
      peinture_internes: '/peinture_int',
      peinture_externes: '/peinture_ext',
      emmanchement: '/emmanchement',
      consommations: '/consommation'
    };
    return routeMap[key] || '/';
  }, []);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 h-full flex flex-col border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{config.title}</CardTitle>
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`w-5 h-5 ${config.textColor}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4 my-2" />
        ) : (
          <div className="text-3xl font-bold mb-2">{data ?? 0}</div>
        )}
        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
        <Button asChild variant="outline" className="w-full mt-auto" size="sm">
          <Link to={getRoutePath(config.key)}>
            {config.buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
});

export default function TableauDeBord() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      from: new Date(),
      to: new Date(),
    },
  });
  
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientApi.getAll,
    staleTime: 60 * 1000 // 1 minute
  });

  // Stagger queries with increasing staleTimes
  const queries = useQueries({
    queries: cardConfig.map((config, index) => ({
      queryKey: [config.key],
      queryFn: config.api,
      select: (data) => data?.data?.data?.length || 0,
      staleTime: 1000 * (index + 1), // Incremental stale time
    })),
  });

  const exportMutation = useMutation({
    mutationFn: (payload) => 
      customAxios.get('api/export-production', {
        params: payload,
        responseType: 'blob'
      })
  });

  const clientOptions = useMemo(() => 
    clientsData?.data?.data?.map((client) => ({
      label: client.Client,
      value: client.codeClient,
    })) || [],
    [clientsData]
  );

  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error;

  const formatDate = useCallback((date) => format(date, 'yy-MM-dd HH:mm'), []);
const onSubmit = async (data) => {
  try {
    const payload = {
      client: data.client,
      from: formatDate(data.from),
      to: formatDate(data.to),
    };
    
    const response = await exportMutation.mutateAsync(payload);

    // استخراج اسم الملف من الهيدر
    const disposition = response.headers['content-disposition'];
    const fileNameMatch = disposition && disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const fileName = fileNameMatch ? fileNameMatch[1].replace(/['"]/g, '') : 'production-report.xlsx';

    // إنشاء الملف وتحميله
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export error:', err);
  }
};

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold">Échec du chargement du tableau de bord</h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord de Production</h1>
          <p className="text-muted-foreground">Données de fabrication en temps réel</p>
        </div>
        <Suspense fallback={<Button disabled>Loading...</Button>}>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Importer Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Importer des données</DialogTitle>
                <DialogDescription>
                  Sélectionnez un client et une période pour importer les données.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Controller
                      name="client"
                      control={form.control}
                      render={({ field }) => (
                        <AutocompleteInput
                          data={clientOptions}
                          text="Sélectionnez un client"
                          place="Choisissez parmi les suggestions"
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                      )}
                    />
                    {form.formState.errors.client && (
                      <p className="col-span-4 text-right text-sm text-red-500">
                        {form.formState.errors.client.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="from" className="text-right">
                      De
                    </Label>
                    <Controller
                      name="from"
                      control={form.control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="col-span-3 justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Choisir une date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="to" className="text-right">
                      À
                    </Label>
                    <Controller
                      name="to"
                      control={form.control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="col-span-3 justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Choisir une date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={exportMutation.isPending}
                  >
                    {exportMutation.isPending ? "Importing..." : "Importer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Suspense>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4 my-2" />
                <Skeleton className="h-4 w-full my-2" />
                <Skeleton className="h-9 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cardConfig.map((config, i) => (
            <DashboardCard
              key={config.key}
              config={config}
              data={queries[i].data}
              isLoading={queries[i].isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}