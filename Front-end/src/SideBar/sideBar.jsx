import { 
  Calendar, Home, Inbox, Search, Settings, SquareChartGantt, 
  ChevronDown, Factory, Gauge, Layers, Wrench, 
  Paintbrush, SprayCan, CircleDashed, Box, Users, 
  Sliders, HardHat, Clipboard, Database, Package,
  ToolCase
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible"

// Menu items with more descriptive icons
const mainItems = [
  {
    title: "Client",
    url: "/client",
    icon: Users,
    color: "text-indigo-400",
  },
  {
    title: "OF",
    url: "/of",
    icon: Clipboard,
    color: "text-blue-400",
  },
  {
    title: "Article",
    url: "/article",
    icon: Package,
    color: "text-emerald-400",
  },
  {
    title: "Categorie Article",
    url: "/categorie",
    icon: Box,
    color: "text-amber-400",
  },
  {
    title: "Defaut",
    url: "/defaut",
    icon: CircleDashed,
    color: "text-rose-400",
  },
  {
    title: "Consommation",
    url: "/consommation",
    icon: Gauge,
    color: "text-cyan-400",
  },
  {
    title: "Tube HS-shute",
    url: "/tubeHS",
    icon: Layers,
    color: "text-fuchsia-400",
  },
  {
    title: "Statut Tube",
    url: "/statut",
    icon: Database,
    color: "text-sky-400",
  },
  {
    title: "Operateur",
    url: "/operateur",
    icon: HardHat,
    color: "text-orange-400",
  },
  {
    title: "Machine",
    url: "/machine",
    icon: Settings,
    color: "text-violet-400",
  },
  {
    title: "Causse",
    url: "/causse",
    icon: Sliders,
    color: "text-lime-400",
  },
]

const processItems = [
  { title: "Production", url: "/production", icon: Factory },
  { title: "Reparation", url: "/reparation", icon: Wrench }, 
   { title: "Manchette ISO", url: "/manchette", icon: CircleDashed },
  
  { title: "Sablage Externe", url: "/sablage_ext", icon: SprayCan }, 
  { title: "Peinture Externe", url: "/peinture_ext", icon: Paintbrush },

  { title: "Sablage Interne", url: "/sablage_int", icon: SprayCan }, 
   { title: "Peinture Interne", url: "/peinture_int", icon: Paintbrush },

  { title: "Emmanchement", url: "/emmanchement", icon: ToolCase },
]

export function AppSidebar() {
  const location = useLocation()
  
  const isActive = (url) => {
    return location.pathname === url
  }

  return (
    <Sidebar className="h-screen w-70  fixed left-0 -top-4 bg-gray-50 my-30 dark:bg-gray-800 border-r  border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out flex flex-col">
      {/* Logo and Title */}
      <div className="p-5 pb-3 mb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Tube Management</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Industrial Solutions</p>
          </div>
        </div>
      </div>

      <SidebarContent className="px-3 flex-1">
        {/* Process Group */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
            Tube Processes
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors ${
                        processItems.some(item => isActive(item.url)) ? 
                        'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 w-full' : 
                        'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <SquareChartGantt className="w-5 h-5 opacity-80" />
                        <span className="text-sm">Manufacturing Flow</span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-gray-400" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <SidebarMenuSub className="ml-2 pl-5 border-l border-gray-200 dark:border-gray-700 space-y-1">
                      {processItems.map((item) => (
                        <SidebarMenuSubItem 
                          key={item.url}
                          className={`px-2.5 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                            isActive(item.url) ? 
                            'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-medium' : 
                            'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <Link to={item.url} className="w-full flex items-center gap-2">
                            <item.icon className="w-4 h-4 opacity-70" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Menu Items */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
            Data Management
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-1 pb-30">
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.url) ? 
                      'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300' : 
                      'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mb-20">

      </div>

    </Sidebar>
  )
}