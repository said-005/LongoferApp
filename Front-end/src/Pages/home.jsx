import { useQueries } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Package,
  Cpu,
  UserCog,
  AlertTriangle,
  AlertCircle,
  Layers,
  Factory,
  Gauge,
  ClipboardList,
  Wrench,
  SprayCan,
  Drill,
  Hammer,
  FlaskConical,
  Brush
} from "lucide-react";

// Importations des API
import { ClientApi } from './../Api/ClientApi';
import { ArticleApi } from '../Api/ArticleApi';
import { MachineApi } from '../Api/machineApi';
import { OperateurApi } from '../Api/operateurApi';
import { StatutApi } from '../Api/StatutApi';
import { TubeHSApi } from '../Api/TubeHSApi';
import { DefautApi } from '../Api/defautApi';
import { CategorieApi } from '../Api/CategorieApi';
import { ConsommaationApi } from '../Api/consommationApi';
import { OfApi } from '../Api/ofApi';
import { ProductionApi } from '../Api/ProductionApi';
import { ReparationApi } from '../Api/ReparationApi';
import { ManchetteApi } from '../Api/Manchette';
import { SablageIntApi } from '../Api/SablageIntApi';
import { SablageEXTApi } from '../Api/Sablage_Ext';
import { PeintureIntApi } from '../Api/peinture_intApi';
import { PeintureExtApi } from '../Api/peinture_extApi';
import { EmmanchementApi } from '../Api/Emmanchement';
import { CausseApi } from "../Api/causseApi";
import { Link } from "react-router-dom";

// ====================== CONFIGURATION DES CARTES ======================
const cardConfig = [
  // Métriques principales
  {
    key: "clients",
    title: "Clients",
    description: "Nombre total de clients enregistrés",
    api: ClientApi.getAll,
    buttonText: "Voir les clients",
    icon: Users,
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    textColor: "text-blue-600 dark:text-blue-300",
  },
  {
    key: "articles",
    title: "Articles",
    description: "Articles en stock",
    api: ArticleApi.getAll,
    buttonText: "Voir l'inventaire",
    icon: Package,
    bgColor: "bg-green-100 dark:bg-green-900/50",
    textColor: "text-green-600 dark:text-green-300",
  },
  {
    key: "machines",
    title: "Machines",
    description: "Unités de production",
    api: MachineApi.getAll,
    buttonText: "Voir les machines",
    icon: Cpu,
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
    textColor: "text-purple-600 dark:text-purple-300",
  },

  // Opérateurs & Production
  {
    key: "operateurs",
    title: "Opérateurs",
    description: "Personnel actif",
    api: OperateurApi.getAll,
    buttonText: "Gérer les opérateurs",
    icon: UserCog,
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    textColor: "text-orange-600 dark:text-orange-300",
  },
  {
    key: "production",
    title: "Production",
    description: "Ordres actifs",
    api: ProductionApi.getAll,
    buttonText: "Voir la production",
    icon: Factory,
    bgColor: "bg-amber-100 dark:bg-amber-900/50",
    textColor: "text-amber-600 dark:text-amber-300",
  },
  {
    key: "ofs",
    title: "Ordres de travail",
    description: "OF actifs",
    api: OfApi.getAll,
    buttonText: "Voir les ordres",
    icon: ClipboardList,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/50",
    textColor: "text-indigo-600 dark:text-indigo-300",
  },

  // Contrôle qualité
  {
    key: "defauts",
    title: "Défauts",
    description: "Problèmes enregistrés",
    api: DefautApi.getAll,
    buttonText: "Inspecter les défauts",
    icon: AlertCircle,
    bgColor: "bg-red-100 dark:bg-red-900/50",
    textColor: "text-red-600 dark:text-red-300",
  },
  {
    key: "tube_hs",
    title: "Tubes défectueux",
    description: "Unités défectueuses",
    api: TubeHSApi.getAll,
    buttonText: "Vérifier les tubes",
    icon: AlertTriangle,
    bgColor: "bg-rose-100 dark:bg-rose-900/50",
    textColor: "text-rose-600 dark:text-rose-300",
  },
  {
    key: "statuts",
    title: "Statuts",
    description: "Statuts du système",
    api: StatutApi.getAll,
    buttonText: "Voir les statuts",
    icon: Gauge,
    bgColor: "bg-teal-100 dark:bg-teal-900/50",
    textColor: "text-teal-600 dark:text-teal-300",
  },
  {
    key: "causses",
    title: "Causes",
    description: "Causes des défauts",
    api: CausseApi.getAll,
    buttonText: "Voir les causes",
    icon: AlertCircle,
    bgColor: "bg-red-100 dark:bg-red-900/50",
    textColor: "text-red-600 dark:text-red-300",
  },

  // Maintenance & Réparations
  {
    key: "reparations",
    title: "Réparations",
    description: "Correctifs en attente",
    api: ReparationApi.getAll,
    buttonText: "Suivre les réparations",
    icon: Wrench,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    textColor: "text-yellow-600 dark:text-yellow-300",
  },
  {
    key: "categories",
    title: "Catégories",
    description: "Catégories de produits",
    api: CategorieApi.getAll,
    buttonText: "Voir les catégories",
    icon: Layers,
    bgColor: "bg-violet-100 dark:bg-violet-900/50",
    textColor: "text-violet-600 dark:text-violet-300",
  },

  // Processus de fabrication
  {
    key: "manchettes",
    title: "Manchettes",
    description: "Opérations de manchettes",
    api: ManchetteApi.getAll,
    buttonText: "Voir les manchettes",
    icon: Drill,
    bgColor: "bg-sky-100 dark:bg-sky-900/50",
    textColor: "text-sky-600 dark:text-sky-300",
  },
  {
    key: "sablage_internes",
    title: "Sablage interne",
    description: "Sablage interne",
    api: SablageIntApi.getAll,
    buttonText: "Voir le processus",
    icon: SprayCan,
    bgColor: "bg-amber-100 dark:bg-amber-900/50",
    textColor: "text-amber-600 dark:text-amber-300",
  },
  {
    key: "sablage_externes",
    title: "Sablage externe",
    description: "Sablage externe",
    api: SablageEXTApi.getAll,
    buttonText: "Voir le processus",
    icon: SprayCan,
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    textColor: "text-orange-600 dark:text-orange-300",
  },
  {
    key: "peinture_internes",
    title: "Peinture intérieure",
    description: "Peinture intérieure",
    api: PeintureIntApi.getAll,
    buttonText: "Voir le processus",
    icon: Brush,
    bgColor: "bg-pink-100 dark:bg-pink-900/50",
    textColor: "text-pink-600 dark:text-pink-300",
  },
  {
    key: "peinture_externes",
    title: "Peinture extérieure",
    description: "Peinture extérieure",
    api: PeintureExtApi.getAll,
    buttonText: "Voir le processus",
    icon: Brush,
    bgColor: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
    textColor: "text-fuchsia-600 dark:text-fuchsia-300",
  },
  {
    key: "emmanchement",
    title: "Assemblage",
    description: "Emmanchement",
    api: EmmanchementApi.getAll,
    buttonText: "Voir l'assemblage",
    icon: Hammer,
    bgColor: "bg-lime-100 dark:bg-lime-900/50",
    textColor: "text-lime-600 dark:text-lime-300",
  },

  // Ressources & Consommables
  {
    key: "consommations",
    title: "Consommables",
    description: "Utilisation des ressources",
    api: ConsommaationApi.getAll,
    buttonText: "Voir les consommables",
    icon: FlaskConical,
    bgColor: "bg-emerald-100 dark:bg-emerald-900/50",
    textColor: "text-emerald-600 dark:text-emerald-300",
  },
];

// ====================== COMPOSANT CARTE ======================
const DashboardCard = ({ config, data, isLoading }) => {
  const Icon = config.icon;
  
  // Configuration des routes
  const getRoutePath = (key) => {
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
  };

 

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
};

// ====================== PAGE PRINCIPALE ======================
export default function TableauDeBord() {
  const queries = useQueries({
    queries: cardConfig.map((config) => ({
      queryKey: [config.key],
      queryFn: config.api,
      select: (data) => data?.data?.data?.length || 0,
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error;

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord de Production</h1>
        <p className="text-muted-foreground">Données de fabrication en temps réel</p>
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