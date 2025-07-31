"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";

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
import { toast } from "sonner";
import { customAxios } from "../Axios/axiosApi";
import { useNavigate } from "react-router-dom";

// Schéma de validation du formulaire
const FormSchema = z.object({
  newPassword: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export function PasswordChangeForm() {
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async (newPassword) => {
      const payload = {
        password: newPassword,
        password_confirmation: newPassword
      };
      const response = await customAxios.post('api/change-password', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès");
      form.reset();
      // Navigation optionnelle après succès
      // navigate('/chemin');
    },
    onError: (error) => {
      toast.error("Échec de la modification du mot de passe");
    }
  });

  function onSubmit(data) {
    changePassword(data.newPassword);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 mx-auto space-y-6 mt-50 shadow-2xl p-8 rounded-2xl">
        <h1 className="text-center font-bold text-2xl">Changer le mot de passe</h1>
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Entrez votre nouveau mot de passe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="mr-2" disabled={isPending}>
          {isPending ? "Modification en cours..." : "Changer le mot de passe"}
        </Button>
        <Button 
          type='button' 
          variant='outline' 
          onClick={() => navigate('/login')}
          disabled={isPending}
        >
          Annuler
        </Button>
      </form>
    </Form>
  );
}