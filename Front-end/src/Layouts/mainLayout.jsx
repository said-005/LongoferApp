import { Link, Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from "../SideBar/sideBar";
import Longofer from '../assets/images/longoferlogo1400-700.jpg';
import { useEffect, useState } from 'react';
import ModeToggle from '@/components/mode-toggle';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('authenticated')) {
      navigate('/login');
    } else {
      setAuthChecked(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    navigate('/login');
  };

  if (!authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 dark:border-emerald-400"></div>
      </div>
    );
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen min-w-full flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-emerald-800 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-teal-800 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-cyan-800 animate-blob animation-delay-4000" />
        </div>
   
        {/* Sticky header */}
        <header className={`fixed top-0 w-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg py-2' : 'shadow-sm py-3'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-5">
                <img 
                  src={Longofer} 
                  alt="Longofer Logo" 
                  className={`h-10 w-auto transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`} 
                />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                  Longofer
                </span>
              </div> 
              
              <div className="flex gap-4 items-center justify-center">
                <Link 
                  to={'/home'} 
                  className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Dashboard
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
                </Link>
                
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  className="gap-2 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
                
                <ModeToggle 
                  className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 pt-16">
          {/* Sidebar with Dashboard link */}
          <aside className="hidden md:block fixed h-[calc(100vh-4rem)] w-64 z-40">
            <AppSidebar />
          </aside>

          {/* Content container */}
          <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto mb-20 pb-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 w-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 py-3">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Longofer. All rights reserved.
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
}