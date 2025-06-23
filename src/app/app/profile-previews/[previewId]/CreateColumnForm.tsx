"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { DataProvider } from "@prisma/client";

// Type for preview data
type ProfilePreviewData = {
  id: string;
  name?: string | null;
  description?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  school?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  age?: number | null;
  defaultBio?: string | null;
  fromCity?: string | null;
  fromCountry?: string | null;
};

const createColumnSchema = z.object({
  type: z.nativeEnum(DataProvider),
  bio: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  age: z.coerce.number().optional(),
  fromCity: z.string().optional(),
  fromCountry: z.string().optional(),
});

type CreateColumnFormData = z.infer<typeof createColumnSchema>;

interface CreateColumnFormProps {
  previewId: string;
  preview: ProfilePreviewData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const dataProviderOptions = [
  { value: DataProvider.TINDER, label: "Tinder 🔥" },
  { value: DataProvider.HINGE, label: "Hinge 💝" },
  { value: DataProvider.BUMBLE, label: "Bumble 🐝" },
  { value: DataProvider.GRINDER, label: "Grindr 🟡" },
  { value: DataProvider.BADOO, label: "Badoo" },
  { value: DataProvider.OK_CUPID, label: "OkCupid" },
  { value: DataProvider.FEELD, label: "Feeld" },
];

export function CreateColumnForm({
  previewId,
  preview,
  onSuccess,
  onCancel,
}: CreateColumnFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useDefaults, setUseDefaults] = useState(true);

  const form = useForm<CreateColumnFormData>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      type: DataProvider.TINDER,
      bio: useDefaults ? preview.defaultBio || "" : "",
      jobTitle: useDefaults ? preview.jobTitle || "" : "",
      company: useDefaults ? preview.company || "" : "",
      school: useDefaults ? preview.school || "" : "",
      city: useDefaults ? preview.city || "" : "",
      state: useDefaults ? preview.state || "" : "",
      country: useDefaults ? preview.country || "" : "",
      age: useDefaults ? preview.age || undefined : undefined,
      fromCity: useDefaults ? preview.fromCity || "" : "",
      fromCountry: useDefaults ? preview.fromCountry || "" : "",
    },
  });

  const createColumn = api.profilePreviews.createColumn.useMutation({
    onSuccess: () => {
      toast.success("Column created successfully!");
      onSuccess?.();
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create column");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: CreateColumnFormData) => {
    setIsSubmitting(true);
    createColumn.mutate({
      previewId,
      ...data,
    });
  };

  const fillWithDefaults = () => {
    form.setValue("bio", preview.defaultBio || "");
    form.setValue("jobTitle", preview.jobTitle || "");
    form.setValue("company", preview.company || "");
    form.setValue("school", preview.school || "");
    form.setValue("city", preview.city || "");
    form.setValue("state", preview.state || "");
    form.setValue("country", preview.country || "");
    form.setValue("age", preview.age || undefined);
    form.setValue("fromCity", preview.fromCity || "");
    form.setValue("fromCountry", preview.fromCountry || "");
    setUseDefaults(true);
  };

  const clearAll = () => {
    form.setValue("bio", "");
    form.setValue("jobTitle", "");
    form.setValue("company", "");
    form.setValue("school", "");
    form.setValue("city", "");
    form.setValue("state", "");
    form.setValue("country", "");
    form.setValue("age", undefined);
    form.setValue("fromCity", "");
    form.setValue("fromCountry", "");
    setUseDefaults(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* App Type Selection */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dating App</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dating app" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dataProviderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quick Actions */}
        <div className="flex gap-2 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillWithDefaults}
          >
            Use Default Values
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Profile Information</h4>
          <p className="text-muted-foreground text-sm">
            Leave fields blank to use the preview defaults
          </p>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Marketing Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Love exploring new places, trying different cuisines, and having great conversations..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This bio will be used for this specific app variation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Column"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
