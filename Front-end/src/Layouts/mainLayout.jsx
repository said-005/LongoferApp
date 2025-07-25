import { Outlet } from "react-router-dom";
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from "../SideBar/sideBar";
import Longofer from '../assets/images/longoferlogo1400-700.jpg';
import { useEffect, useState } from 'react';

export default function MainLayout() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen min-w-full flex flex-col bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-blue-800 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-indigo-800 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-cyan-800 animate-blob animation-delay-4000"></div>
        </div>
   
        {/* Header with scroll effects */}
        <header className={`fixed top-0 min-w-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 z-50 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <img 
                src={Longofer} 
                alt="Company Logo" 
                className={`w-40 h-auto transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`} 
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Longofer
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="hidden md:block fixed h-[calc(100vh-4rem)] z-40">
            <AppSidebar className=""/>  
          </div>

          {/* Content with elegant transitions */}
          <main className="flex-1 md:ml-64 mt-16 p-4 sm:p-6 lg:p-8 transition-all duration-300 mb-20">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Subtle footer */}
        <footer className="mt-20 fixed bottom-0 w-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 py-2 px-4 text-center text-sm text-gray-500 dark:text-gray-400 z-40">
          © {new Date().getFullYear()} Longofer. All rights reserved.
        </footer>
      </div>
    </SidebarProvider>
  );
}