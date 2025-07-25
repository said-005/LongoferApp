import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/mainLayout";
//import Home from "../Pages/home";

import { ClientForm } from "../Pages/Client/AddClientForm";
import ClientsList from "../Pages/Client/ClientList";
import OFList from "../Pages/OF/OfList";
import { OFForm } from "../Pages/OF/AddOf";
import ArticleList from "../Pages/Article/ArticleList";
import { ArticleForm } from "../Pages/Article/AddArticle";
import CategorieList from "../Pages/CategorieArticle/CategorieList";
import { CategoryForm } from "../Pages/CategorieArticle/AddCategorie";
import DefautList from "../Pages/Defaut/DefautList";
import { DefautForm } from "../Pages/Defaut/Adddefaut";
import TubeHSList from "../Pages/Tube_HS-chute/Tube_HSList";
import { TubeHSForm } from "../Pages/Tube_HS-chute/AddTube_HS";
import ConsommationList from './../Pages/Consommation/ConsommationList';
import { ConsommationForm } from './../Pages/Consommation/AddConsommation';
import StatutsList from "../Pages/Statut/StatutList";
import { StatutForm } from "../Pages/Statut/AddStatut";
import OperatorList from "../Pages/Operateur/OperateurList";
import { OperateurForm } from "../Pages/Operateur/AddOperateur";
import NotFound from "../Pages/NoteFound";
import { MachineForm } from "../Pages/machine/Addmachine";
import MachineList from "../Pages/machine/machineList";
import CausseList from './../Pages/causse/causseList';
import { CausseForm } from "../Pages/causse/AddCausse";
import { MatiereForm } from "../Pages/Matiere/AddMatiere";
import MatiereList from "../Pages/Matiere/MatiereList";
import ProductionList from "../Pages/TubeProcess/Production/productionList";
import ProductionForm from "../Pages/TubeProcess/Production/productionForm";
import ReparationList from "../Pages/TubeProcess/Reparation/ReparationList";
import ReparationForm from "../Pages/TubeProcess/Reparation/ReparationForm";
import SablageINTList from "../Pages/TubeProcess/SablageInterne/SablageINTList";
import SablageINTForm from "../Pages/TubeProcess/SablageInterne/SablageINTForm";
import SablageEXTList from "../Pages/TubeProcess/SablageExterne/SablageEXTList";
import SablageEXTForm from "../Pages/TubeProcess/SablageExterne/SablageEXTForm";

import PeintureINTForm from "../Pages/TubeProcess/PeintureInterne/PeintureINTForm";
import PeintureINTList from './../Pages/TubeProcess/PeintureInterne/PeintureINTList';
import PeintureEXTList from './../Pages/TubeProcess/PeintureExterne/PeintureEXTList';
import PeintureEXTForm from "../Pages/TubeProcess/PeintureExterne/PeintureEXTForm";
import ManchetteList from "../Pages/TubeProcess/Manchette_ISO/ManchetteList";
import ManchetteForm from "../Pages/TubeProcess/Manchette_ISO/ManchetteForm";
import EmmanchementList from "../Pages/TubeProcess/Emmanchement/EmmanchementList";
import EmmanchementForm from './../Pages/TubeProcess/Emmanchement/EmmanchementForm';


 export const Routers=createBrowserRouter([
    {
        element:<MainLayout/>,
        children: [
            // {
            //     path:'/',
            //     element:<Home/>
            // },
          {
                path:'/production',
                element:<ProductionList/>
            },
           
               {
                path:'/production/addProduction',
                element:<ProductionForm/>
            },
               {
                path:'/reparation',
                element:<ReparationList/>
            },
           
               {
                path:'/reparation/addReparation',
                element:<ReparationForm/>
            },
               {
                path:'/sablage_int',
                element:<SablageINTList/>
            },
           
               {
                path:'/sablage_int/addSablage_int',
                element:<SablageINTForm/>
            },
                  {
                path:'/sablage_ext',
                element:<SablageEXTList/>
            },
           
               {
                path:'/sablage_ext/addSablage_ext',
                element:<SablageEXTForm/>
            },
                   {
                path:'/peinture_int',
                element:<PeintureINTList/>
            },
            
           
               {
                path:'/peinture_int/AddPeinture_int',
                element:<PeintureINTForm/>
            },
                      {
                path:'/peinture_ext',
                element:<PeintureEXTList/>
            },
            
           
               {
                path:'/peinture_ext/AddPeinture_ext',
                element:<PeintureEXTForm/>
            },
                         {
                path:'/manchette',
                element:<ManchetteList/>
            },
            
           
               {
                path:'/manchette/AddManchette',
                element:<ManchetteForm/>
            },
                            {
                path:'/emmanchement',
                element:<EmmanchementList/>
            },
            
           
               {
                path:'/emmanchement/AddEmmanchement',
                element:<EmmanchementForm/>
            },
              {
                path:'/Client',
                element:<ClientsList/>
            },
               {
                path:'/Client/AddClient',
                element:<ClientForm/>
            },
              {
                path:'/OF',
                element:<OFList/>
            },
               {
                path:'/Of/AddOf',
                element:<OFForm/>
            },
               {
                path:'/article',
                element:<ArticleList/>
            },
               {
                path:'/article/AddArticle',
                element:<ArticleForm/>
            },
               {
                path:'/categorie',
                element:<CategorieList/>
            }
            ,
               {
                path:'/categorie/AddCategorie',
                element:<CategoryForm/>
            },
               {
                path:'/defaut',
                element:<DefautList/>
            }
            ,
               {
                path:'/defaut/AddDefaut',
                element:<DefautForm/>
            },
               {
                path:'/TubeHS',
                element:<TubeHSList/>
            }
            ,
               {
                path:'/TubeHS/AddTubeHS',
                element:<TubeHSForm/>
            },
              {
                path:'/consommation',
                element:<ConsommationList/>
            }
            ,
               {
                path:'/consommation/AddConsommation',
                element:<ConsommationForm/>
            },
              {
                path:'/statut',
                element:<StatutsList/>
            }
            ,
               {
                path:'/statut/AddStatut',
                element:<StatutForm/>
            },
              {
                path:'/operateur',
                element:<OperatorList/>
            }
            ,
               {
                path:'/operateur/AddOperateur',
                element:<OperateurForm/>
            },
              
               {
                path:'/machine',
                element:<MachineList/>
            },
              
               {
                path:'/machine/AddMachine',
                element:<MachineForm/>
            },
                  {
                path:'/causse',
                element:<CausseList/>
            },
              
               {
                path:'/causse/AddCausse',
                element:<CausseForm/>
            },
                         {
                path:'/matiere',
                element:<MatiereList/>
            },
              
               {
                path:'/matiere/AddMatiere',
                element:<MatiereForm/>
            },
               {
            path: '*',
            element: <NotFound/>
            }

        
        


        ]
    }
])