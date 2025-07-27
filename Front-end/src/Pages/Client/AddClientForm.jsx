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
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientApi } from "../../Api/ClientApi";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  codeClient: z.string().min(2, "Must be at least 2 characters"),
  client: z.string().min(2, "Must be at least 2 characters"),
  address: z.string(),
  phone: z.string().min(10, "Must be at least 10 digits").regex(/^[0-9]+$/, "Only numbers allowed"),
  email: z.string().email("Please enter a valid email"),
});

export function ClientForm() {
  const navigate = useNavigate();
  const queryClient=useQueryClient()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeClient: "",
      client: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  const { mutate: createClient, isPending } = useMutation({
    mutationFn: (data) => ClientApi.createClient(data),
    onSuccess: () => {
      toast.success("Client created successfully");
      queryClient.invalidateQueries('clients')
      navigate(-1); // Go back after successful creation

    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message || "Failed to create client");
    }
  });

  function onSubmit(values) {
    const ClientsData = {
      address: values.address,
      Client: values.client,
      codeClient: values.codeClient,
      email: values.email,
      tele: values.phone
    }
    createClient(ClientsData);
  }

  const handleCancel = () => {
    navigate('/client');
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <Card className="w-full max-w-3xl bg-background">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-foreground">
            Client Form
          </h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="codeClient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Code Client*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CL-001" 
                          {...field} 
                          className="bg-background text-foreground border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Client Name*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Client Name" 
                          {...field} 
                          className="bg-background text-foreground border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground">Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123 Main St, City" 
                          {...field} 
                          className="bg-background text-foreground border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0612345678" 
                          {...field} 
                          className="bg-background text-foreground border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="contact@company.com" 
                          {...field} 
                          className="bg-background text-foreground border-border"
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
                  onClick={handleCancel} 
                  className="w-full md:w-auto" 
                  variant="outline"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Client"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}