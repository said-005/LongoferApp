"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AutocompleteInput from "../../AutoComplet/AutoCompletInput";
import { CategorieApi } from "../../Api/CategorieApi";
import { ArticleApi } from "../../Api/ArticleApi";

// Constants
const UNITS = [
  { value: "kg", label: "Kilogramme (kg)" },
  { value: "g", label: "Gramme (g)" },
  { value: "m", label: "Mètre (m)" },
  { value: "cm", label: "Centimètre (cm)" },
  { value: "mm", label: "Millimètre (mm)" },
  { value: "pcs", label: "Pièce (pcs)" },
] ;

const FORM_SCHEMA = z.object({
  articleCode: z.string()
    .min(2, { message: "Minimum 2 caractères" })
    .max(20, { message: "Maximum 20 caractères" }),
  category: z.string().min(2, { message: "Veuillez sélectionner une catégorie" }),
  designation: z.string()
    .min(2, { message: "Minimum 2 caractères" })
    .max(100, { message: "Maximum 100 caractères" }),
  dimension: z.number()
    .min(0.01, { message: "Doit être positif" })
    .max(9999, { message: "Valeur trop élevée" }),
  thickness: z.number()
    .min(0.01, { message: "Doit être positif" })
    .max(999, { message: "Valeur trop élevée" }),
  unit: z.string().min(1, { message: "Veuillez sélectionner une unité" }),
  theoreticalWeight: z.number()
    .min(0.01, { message: "Doit être positif" })
    .max(9999, { message: "Valeur trop élevée" }),
});


const ERROR_MESSAGES = {
  CATEGORY_LOAD: "Échec du chargement des catégories",
  ARTICLE_CREATE: "Échec de la création de l'article",
  SUCCESS: "Article créé avec succès",
};

export function ArticleForm() {
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      articleCode: "",
      category: "",
      designation: "",
      dimension: 0,
      thickness: 0,
      unit: "",
      theoreticalWeight: 0,
    },
  });

  // Fetch categories
  const { 
    data: categoriesData, 
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: CategorieApi.getAll,
    onError: (error) => {
      toast.error(ERROR_MESSAGES.CATEGORY_LOAD, {
        description: error.message,
      });
    },
    select: (data) => data?.data?.data || [],
  });

  // Mutation to create article
  const { mutate: createArticle, isPending: isCreating } = useMutation({
    mutationFn: ArticleApi.createArticel,
    onSuccess: () => {
      toast.success(ERROR_MESSAGES.SUCCESS);
      form.reset();
      navigate('/article');
    },
    onError: (error) => {
      toast.error(ERROR_MESSAGES.ARTICLE_CREATE, {
        description: error.message,
      });
    },
  });

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (confirm("Voulez-vous vraiment annuler? Les modifications non enregistrées seront perdues.")) {
        navigate('/article');
      }
    } else {
      navigate('/article');
    }
  };

  const onSubmit = (values) => {
    createArticle({
      codeArticle: values.articleCode,
      ArticleName: values.designation,
      Unite_Stock: values.unit,
      Poids: values.theoreticalWeight,
      Diametre: values.dimension,
      Epaisseur: values.thickness,
      categorie: values.category 
    });
  };

  const CategorieOptions = categoriesData?.map((cat) => ({
    label: cat.CategorieArticle, 
    value: cat.CategorieArticle,   
  })) || [];

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Créer un nouvel article</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="articleCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code article</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Entrez le code article" 
                          {...field} 
                          disabled={isCreating}
                          aria-label="Code article"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                     
                      <FormControl>
                        <div className="-mt-2">
                          <AutocompleteInput
                            data={CategorieOptions}
                            text="Sélectionnez une catégorie"
                            place="Choisissez parmi les suggestions"
                            value={field.value}
                            onChange={field.onChange}
                            name="category"
                          
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Désignation*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Entrez la description de l'article" 
                          {...field} 
                          disabled={isCreating}
                          aria-label="Désignation"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimension"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimension*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ex: 100x200" 
                          type="number" 
                          min="0.01"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          disabled={isCreating}
                          aria-label="Dimension"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thickness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Épaisseur*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ex: 2.5" 
                          type="number" 
                          min="0.01"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          disabled={isCreating}
                          aria-label="Épaisseur"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unité de stock*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isCreating}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Unité de stock">
                            <SelectValue placeholder="Sélectionnez une unité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="theoreticalWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poids théorique US*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ex: 1.25" 
                          type="number" 
                          min="0.01"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          disabled={isCreating}
                          aria-label="Poids théorique"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isCreating}
                  aria-label="Annuler"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  disabled={isCreating || isCategoriesLoading}
                  aria-label="Enregistrer l'article"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : "Enregistrer l'article"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}