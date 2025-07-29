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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AutocompleteInput from "../../AutoComplet/AutoCompletInput";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { SheetClose } from "@/components/ui/sheet";
import { CategorieApi } from "../../Api/CategorieApi";
import { ArticleApi } from "../../Api/ArticleApi";

const schemaArticle = z.object({
  articleCode: z.string().min(2, { message: "Le code article est requis (min 2 caractères)" }),
  category: z.string().min(2, { message: "La catégorie est requise" }),
  designation: z.string().min(2, { message: "La désignation est requise (min 2 caractères)" }),
  dimension: z.number().min(0.01, { message: "La dimension est requise" }),
  thickness: z.number().min(0.01, { message: "L'épaisseur est requise" }),
  unit: z.string().min(1, { message: "L'unité est requise" }),
  theoreticalWeight: z.number().min(0.01, { message: "Le poids théorique est requis" }),
});

const unités = [
  { value: "kg", label: "Kilogramme (kg)" },
  { value: "g", label: "Gramme (g)" },
  { value: "m", label: "Mètre (m)" },
  { value: "cm", label: "Centimètre (cm)" },
  { value: "mm", label: "Millimètre (mm)" },
  { value: "pcs", label: "Pièce (pcs)" },
];

export function UpdateArticle({ id }) {
  const form = useForm({
    resolver: zodResolver(schemaArticle),
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

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: CategorieApi.getAll,
    select: (data) => data.data.data.map((cat) => ({
      label: cat.CategorieArticle,
      value: cat.CategorieArticle
    })),
    onError: (error) => {
      toast.error("Erreur de chargement des catégories", {
        description: error.message,
      });
    }
  });

  const { data: articleData, isLoading: isLoadingArticle } = useQuery({
    queryKey: ['article', id],
    queryFn: () => ArticleApi.getArticleById(id),
    enabled: !!id,
    onError: (error) => {
      toast.error("Erreur lors du chargement de l'article", {
        description: error.message,
      });
    }
  });

  useEffect(() => {
    if (articleData?.data?.data) {
      const { data } = articleData.data;
      form.reset({
        articleCode: data.codeArticle,
        category: data.categorie,
        designation: data.ArticleName,
        dimension: data.Diametre,
        thickness: data.Epaisseur,
       unit: data.Unite_Stock?.selected || data.Unite_Stock || '',
        theoreticalWeight: data.Poids
      });
    }
  }, [articleData, form]);
  const { mutate: updateArticle, isPending: isUpdating } = useMutation({
    mutationFn: (values) => ArticleApi.updateArticle(id, values),
    onSuccess: () => {
      toast.success("Article mis à jour avec succès");
      document.querySelector('button[data-rsbs-dismiss]')?.click();
    },
    onError: (error) => {
      toast.error("Échec de la mise à jour", {
        description: error.message,
      });
    }
  });

  const handleSubmit = (values) => {
    updateArticle({
      codeArticle: values.articleCode,
      ArticleName: values.designation,
      Unite_Stock: values.unit,
      Poids: values.theoreticalWeight,
      Diametre: values.dimension,
      Epaisseur: values.thickness,
      categorie: values.category 
    });
  };

  const isLoading = isLoadingCategories || isLoadingArticle;

  return (
    <div className="h-full flex justify-center items-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-secondary/50 -mt-6">
          <h1 className="text-2xl font-bold text-center">
            Modifier l'article
          </h1>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="articleCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code article</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Code article" 
                            {...field} 
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
                          <AutocompleteInput
                            data={categories || []}
                            text="Sélectionner une catégorie"
                            place="Choisir parmi les suggestions"
                            value={field.value}
                            onChange={field.onChange}
                            name="category"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Désignation</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Description de l'article" 
                            {...field} 
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
                        <FormLabel>Dimension</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ex: 100x200" 
                            type="number"
                            min="0.01"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                        <FormLabel>Épaisseur</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ex: 2.5" 
                            type="number"
                            min="0.01"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                        <FormLabel>Unité de stock</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une unité" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unités.map((unité) => (
                              <SelectItem key={unité.value} value={unité.value}>
                                {unité.label}
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
                        <FormLabel>Poids théorique</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ex: 1.25" 
                            type="number"
                            min="0.01"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end items-center pt-6 gap-3">
                  <SheetClose asChild>
                    <Button variant="outline" type="button">
                      Annuler
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}