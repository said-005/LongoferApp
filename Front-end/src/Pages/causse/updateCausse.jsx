import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
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
import { toast } from "sonner";
import { CausseApi } from "@/api/causseApi";
import SheetCloseComponent from "../SheetClose";


// Constants
const FORM_SCHEMA = z.object({
  code_causse: z.string().min(2, {
    message: "Cause code must be at least 2 characters.",
  }),
  causse: z.string().min(2, {
    message: "Cause description must be at least 2 characters.",
  }),
});

const ERROR_MESSAGES = {
  FETCH_ERROR: "Failed to load cause data",
  UPDATE_ERROR: "Error updating cause",
  SUCCESS: "Cause updated successfully",
};

export function UpdateCausse({ id, onSuccess }) {
  const queryClient = useQueryClient();

  // Fetch cause data
  const {
    data: causseData,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["causse", id],
    queryFn: () => CausseApi.getCausseById(id),
    onError: (err) => {
      toast.error(ERROR_MESSAGES.FETCH_ERROR, {
        description: err.response?.data?.message || err.message,
      });
    },
  });

  // Mutation for updating data
  const { mutate: updateCausse, isPending } = useMutation({
    mutationFn: (values) =>
      CausseApi.updateCausse(id, values),
    onSuccess: (data) => {
      toast.success(ERROR_MESSAGES.SUCCESS, {
        description: `Code: ${data.code_causse}`,
      });
      queryClient.invalidateQueries({ queryKey: ["causses"] });
      queryClient.invalidateQueries({ queryKey: ["causse", id] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(ERROR_MESSAGES.UPDATE_ERROR, {
        description: error.response?.data?.message || error.message,
      });
    },
  });

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      code_causse: "",
      causse: "",
    },
  });

  // Update form defaults when data is loaded
  useEffect(() => {
    if (causseData?.data?.data) {
      form.reset(causseData.data.data);
    }
  }, [causseData, form]);

  const onSubmit = (values) => {
    updateCausse(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
        <p>{ERROR_MESSAGES.FETCH_ERROR}</p>
        <p className="text-sm mt-1">
          {fetchError instanceof Error
            ? fetchError.message
            : "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code_causse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cause Code *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cause code (e.g., C01)"
                  {...field}
                  disabled={isPending}
                  aria-disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="causse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cause Description *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cause description"
                  {...field}
                  disabled={isPending}
                  aria-disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end items-center gap-4 pt-2">
          <div className="w-xl">
            <SheetCloseComponent />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="min-w-32"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Cause"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}