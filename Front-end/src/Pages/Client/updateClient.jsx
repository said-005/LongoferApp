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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ClientApi } from "../../Api/ClientApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SheetCloseComponent from "../SheetClose";
import { useEffect } from "react";

const formSchema = z.object({
  codeClient: z.string().min(2, "Must be at least 2 characters"),
  client: z.string().min(2, "Must be at least 2 characters"),
  address: z.string().optional(),
  phone: z.string()
    .transform(val => val.trim() === "" ? undefined : val) // Convert empty string to undefined
    .refine(val => val === undefined || (val.length >= 10 && /^[0-9]+$/.test(val)), {
      message: "Must be at least 10 digits and only numbers"
    }),
  email: z.string()
    .transform(val => val.trim() === "" ? undefined : val) // Convert empty string to undefined
    .refine(val => val === undefined || /.+@.+\..+/.test(val), {
      message: "Please enter a valid email"
    }),
});

export function UpdateClient({ codeClient }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // Fetch client data
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['client', codeClient],
    queryFn: () => ClientApi.getClientById(codeClient),
    onError: (error) => {
      toast.error("Failed to load client data", {
        description: error.message || "Please try again later",
      });
    },
    enabled: !!codeClient,
  });

  // Reset form with fetched data
  useEffect(() => {
    if (data?.data) {
      const clientData = data.data.data;
      form.reset({
        codeClient: clientData.codeClient || "",
        client: clientData.Client || "",
        address: clientData.address || "",
        phone: clientData.tele || "",
        email: clientData.email || "",
      });
    }
  }, [data, form]);

  // Update client mutation
  const { mutate: updateClient, isPending } = useMutation({
    mutationFn: (values) => {
      const payload = {
        codeClient: values.codeClient,
        Client: values.client,
        tele: values.phone || null, // Convert empty to null
        address: values.address || null,
        email: values.email || null,
      };
      return ClientApi.updateClient(codeClient, payload);
    },
    onSuccess: () => {
      toast.success("Client updated successfully");
      queryClient.invalidateQueries({ queryKey: ['client', codeClient] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/Client', { replace: true });
    },
    onError: (error) => {
      toast.error("Update failed", {
        description: error.response?.data?.message || "There was an error updating the client",
      });
    }
  });

  const onSubmit = (values) => {
    updateClient(values);
  };

  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full flex justify-center items-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex justify-center items-center p-4">
        <p className="text-destructive">Failed to load client data</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <Card className="w-full max-w-3xl h-full flex flex-col bg-background">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-foreground">Update Client</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 min-h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="codeClient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CL-001" 
                          {...field} 
                          disabled={isPending}
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
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Client Name" 
                          {...field} 
                          disabled={isPending}
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123 Main St, City" 
                          {...field} 
                          disabled={isPending}
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0612345678" 
                          {...field} 
                          disabled={isPending}
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="contact@company.com" 
                          {...field} 
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end items-center pt-4 gap-2">
                <div className="w-1/3">
                  <SheetCloseComponent className="w-full md:w-auto" />
                </div>
                
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
                    "Save Changes"
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