"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "../../Api/Login";
import { useState } from "react";
import ModeToggle from "@/components/mode-toggle";

const formSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [serverError, setServerError] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending: isSubmitting } = useMutation({
    mutationFn: async (data) => {
             
      try {
         await LoginApi.getSCRFtoken()
        return await LoginApi.login(data);
      } catch (error) {
        // Handle CSRF token failure
        if (error.message === "Network Error" || error.response?.status === 0) {
          setServerError(true);
          throw new Error("Le serveur est indisponible. Veuillez réessayer plus tard.");
        }
        throw error;
      }
    },
  onSuccess: (response) => {
  if (response.data?.message === 'Invalid credentials') {
    toast.error('Invalid email or password');
    return;
  }

  toast.success('Login successful!');
  localStorage.setItem('authenticated', 'true');
      navigate('/home');
    },
    onError: (error) => {
      let errorMessage = "Une erreur inattendue s'est produite";
      
      if (error.message === "Le serveur est indisponible. Veuillez réessayer plus tard.") {
        errorMessage = error.message;
      } else if (error.response) {
        // Server responded with error status (4xx, 5xx)
        switch (error.response.status) {
          case 401:
            errorMessage = "Identifiants invalides. Veuillez réessayer.";
            break;
          case 403:
            errorMessage = "Accès refusé. Vérifiez vos autorisations.";
            break;
          case 500:
            errorMessage = "Erreur interne du serveur. Veuillez contacter l'administrateur.";
            setServerError(true);
            break;
          case 503:
            errorMessage = "Service temporairement indisponible. Veuillez réessayer plus tard.";
            setServerError(true);
            break;
          default:
            errorMessage = error.response.data?.message || "Erreur lors de la connexion";
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Pas de réponse du serveur. Vérifiez votre connexion internet.";
        setServerError(true);
      } else {
        // Something happened in setting up the request
        errorMessage = "Erreur de configuration de la requête";
      }

      toast.error("Échec de la connexion", {
        description: errorMessage,
        action: serverError ? {
          label: "Réessayer",
          onClick: () => window.location.reload(),
        } : undefined,
      });
    }
  });

  const onSubmit = async (values) => {
    login(values);
  };

  if (serverError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-1">
            <h1 className="text-3xl font-bold text-destructive">Erreur du serveur</h1>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Le serveur est actuellement indisponible. Veuillez réessayer plus tard.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-blue-800" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 dark:bg-indigo-800" />
      </div>

      {/* Theme toggle button */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      
      {/* Login card */}
      <Card className="w-full max-w-md relative z-10 border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg opacity-60 -z-10" />
        <CardHeader className="text-center space-y-1">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Bienvenue
          </h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="votre@email.com"
                        {...field}
                        type="email"
                        autoComplete="email"
                        className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-foreground">Mot de passe</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          {...field}
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isSubmitting}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <span className="flex items-center justify-center">
                    Se connecter
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}