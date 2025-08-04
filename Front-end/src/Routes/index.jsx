import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/mainLayout";
import LoginPage from "../Pages/Login/login";
import NotFound from "../Pages/NoteFound";

// Client routes
import { ClientForm } from "../Pages/Client/AddClientForm";
import ClientsList from "../Pages/Client/ClientList";

// OF routes
import OFList from "../Pages/OF/OfList";
import { OFForm } from "../Pages/OF/AddOf";

// Article routes
import ArticleList from "../Pages/Article/ArticleList";
import { ArticleForm } from "../Pages/Article/AddArticle";

// Category routes
import CategorieList from "../Pages/CategorieArticle/CategorieList";
import { CategoryForm } from "../Pages/CategorieArticle/AddCategorie";

// Defaut routes
import DefautList from "../Pages/Defaut/DefautList";
import { DefautForm } from "../Pages/Defaut/Adddefaut";

// Tube HS routes
import TubeHSList from "../Pages/Tube_HS-chute/Tube_HSList";
import { TubeHSForm } from "../Pages/Tube_HS-chute/AddTube_HS";

// Consommation routes
import ConsommationList from '../Pages/Consommation/ConsommationList';
import { ConsommationForm } from '../Pages/Consommation/AddConsommation';

// Statut routes
import StatutsList from "../Pages/Statut/StatutList";
import { StatutForm } from "../Pages/Statut/AddStatut";

// Operator routes
import OperatorList from "../Pages/Operateur/OperateurList";
import { OperateurForm } from "../Pages/Operateur/AddOperateur";

// Machine routes
import { MachineForm } from "../Pages/machine/Addmachine";
import MachineList from "../Pages/machine/machineList";

// Causse routes
import CausseList from '../Pages/causse/causseList';
import { CausseForm } from "../Pages/causse/AddCausse";
// Tube Process routes
import ProductionList from "../Pages/TubeProcess/Production/productionList";
import ProductionForm from "../Pages/TubeProcess/Production/productionForm";
import ReparationList from "../Pages/TubeProcess/Reparation/ReparationList";
import ReparationForm from "../Pages/TubeProcess/Reparation/ReparationForm";
import SablageINTList from "../Pages/TubeProcess/SablageInterne/SablageINTList";
import SablageINTForm from "../Pages/TubeProcess/SablageInterne/SablageINTForm";
import SablageEXTList from "../Pages/TubeProcess/SablageExterne/SablageEXTList";
import SablageEXTForm from "../Pages/TubeProcess/SablageExterne/SablageEXTForm";
import PeintureINTForm from "../Pages/TubeProcess/PeintureInterne/PeintureINTForm";
import PeintureINTList from '../Pages/TubeProcess/PeintureInterne/PeintureINTList';
import PeintureEXTList from '../Pages/TubeProcess/PeintureExterne/PeintureEXTList';
import PeintureEXTForm from "../Pages/TubeProcess/PeintureExterne/PeintureEXTForm";
import ManchetteList from "../Pages/TubeProcess/Manchette_ISO/ManchetteList";
import ManchetteForm from "../Pages/TubeProcess/Manchette_ISO/ManchetteForm";
import EmmanchementList from "../Pages/TubeProcess/Emmanchement/EmmanchementList";
import EmmanchementForm from '../Pages/TubeProcess/Emmanchement/EmmanchementForm';
import Home from "../Pages/home";
import { PasswordChangeForm } from "../Pages/ChangePassword";

export const Routers = createBrowserRouter(
  [
  {
     
    element: <MainLayout />,
    children: [
    {
    path: '/home',
    element: <Home />
},
{
    index: true,
    element: <Home />
},
      // Tube Process Routes

      {
        path: '/production',
        element: <ProductionList />
      },
      {
        path: '/production/addProduction',
        element: <ProductionForm />
      },
      {
        path: '/reparation',
        element: <ReparationList />
      },
      {
        path: '/reparation/addReparation',
        element: <ReparationForm />
      },
      {
        path: '/sablage_int',
        element: <SablageINTList />
      },
      {
        path: '/sablage_int/addSablage_int',
        element: <SablageINTForm />
      },
      {
        path: '/sablage_ext',
        element: <SablageEXTList />
      },
      {
        path: '/sablage_ext/addSablage_ext',
        element: <SablageEXTForm />
      },
      {
        path: '/peinture_int',
        element: <PeintureINTList />
      },
      {
        path: '/peinture_int/AddPeinture_int',
        element: <PeintureINTForm />
      },
      {
        path: '/peinture_ext',
        element: <PeintureEXTList />
      },
      {
        path: '/peinture_ext/AddPeinture_ext',
        element: <PeintureEXTForm />
      },
      {
        path: '/manchette',
        element: <ManchetteList />
      },
      {
        path: '/manchette/AddManchette',
        element: <ManchetteForm />
      },
      {
        path: '/emmanchement',
        element: <EmmanchementList />
      },
      {
        path: '/emmanchement/AddEmmanchement',
        element: <EmmanchementForm />
      },

      // Client Routes
      {
        path: '/Client',
        element: <ClientsList />
      },
      {
        path: '/Client/AddClient',
        element: <ClientForm />
      },

      // OF Routes
      {
        path: '/OF',
        element: <OFList />
      },
      {
        path: '/Of/AddOf',
        element: <OFForm />
      },

      // Article Routes
      {
        path: '/article',
        element: <ArticleList />
      },
      {
        path: '/article/AddArticle',
        element: <ArticleForm />
      },

      // Category Routes
      {
        path: '/categorie',
        element: <CategorieList />
      },
      {
        path: '/categorie/AddCategorie',
        element: <CategoryForm />
      },

      // Defaut Routes
      {
        path: '/defaut',
        element: <DefautList />
      },
      {
        path: '/defaut/AddDefaut',
        element: <DefautForm />
      },

      // Tube HS Routes
      {
        path: '/TubeHS',
        element: <TubeHSList />
      },
      {
        path: '/TubeHS/AddTubeHS',
        element: <TubeHSForm />
      },

      // Consommation Routes
      {
        path: '/consommation',
        element: <ConsommationList />
      },
      {
        path: '/consommation/AddConsommation',
        element: <ConsommationForm />
      },

      // Statut Routes
      {
        path: '/statut',
        element: <StatutsList />
      },
      {
        path: '/statut/AddStatut',
        element: <StatutForm />
      },

      // Operator Routes
      {
        path: '/operateur',
        element: <OperatorList />
      },
      {
        path: '/operateur/AddOperateur',
        element: <OperateurForm />
      },

      // Machine Routes
      {
        path: '/machine',
        element: <MachineList />
      },
      {
        path: '/machine/AddMachine',
        element: <MachineForm />
      },

      // Causse Routes
      {
        path: '/causse',
        element: <CausseList />
      },
      {
        path: '/causse/AddCausse',
        element: <CausseForm />
      },

      // Catch-all route
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
   {
    path: '/forgot-password',
    element: <PasswordChangeForm/>
  }

],
)