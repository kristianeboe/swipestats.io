"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Switch } from "@/app/_components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Badge } from "@/app/_components/ui/badge";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { DataProvider, Gender } from "@prisma/client";

// Type for preview data
type ProfilePreviewData = {
  id: string;
  name?: string | null;
  description?: string | null;
  firstName?: string | null;
  gender?: Gender | null;
  age?: number | null;
  defaultBio?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  school?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  hometown?: string | null;
  nationality?: string | null;
  fromCity?: string | null;
  fromCountry?: string | null;
};

const createColumnSchema = z.object({
  type: z.nativeEnum(DataProvider),
  label: z.string().optional(),
  firstName: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  age: z.coerce.number().optional(),
  bio: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  hometown: z.string().optional(),
  nationality: z.string().optional(),
  fromCity: z.string().optional(),
  fromCountry: z.string().optional(),
  // Photo copying
  copyPhotos: z.boolean().optional(),
  sourceColumnId: z.string().optional(),
});

type CreateColumnFormData = z.infer<typeof createColumnSchema>;

interface CreateColumnFormProps {
  previewId: string;
  preview: ProfilePreviewData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const dataProviderOptions = [
  { value: DataProvider.TINDER, label: "Tinder 🔥", icon: "🔥" },
  { value: DataProvider.HINGE, label: "Hinge 🔒", icon: "🔒" },
  { value: DataProvider.BUMBLE, label: "Bumble 🐝", icon: "🐝" },
  { value: DataProvider.RAYA, label: "Raya 💎", icon: "💎" },
  { value: DataProvider.GRINDER, label: "Grindr 🟡", icon: "🟡" },
  { value: DataProvider.BADOO, label: "Badoo 💜", icon: "💜" },
  { value: DataProvider.OK_CUPID, label: "OkCupid 💙", icon: "💙" },
  { value: DataProvider.FEELD, label: "Feeld 🌈", icon: "🌈" },
];

export function CreateColumnForm({
  previewId,
  preview,
  onSuccess,
  onCancel,
}: CreateColumnFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useDefaults, setUseDefaults] = useState(true);

  // Get existing previews for photo copying
  const { data: existingPreviews } =
    api.profilePreviews.getAllForDropdown.useQuery();

  // Check if user has any existing previews with photos
  const hasExistingPhotos = useMemo(() => {
    return (
      existingPreviews?.some((preview) =>
        preview.columns.some((column) => column._count.mediaAssets > 0),
      ) ?? false
    );
  }, [existingPreviews]);

  const form = useForm<CreateColumnFormData>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      type: DataProvider.TINDER,
      label: "",
      firstName: useDefaults ? preview.firstName || "" : "",
      gender: useDefaults ? preview.gender || undefined : undefined,
      age: useDefaults ? preview.age || undefined : undefined,
      bio: useDefaults ? preview.defaultBio || "" : "",
      jobTitle: useDefaults ? preview.jobTitle || "" : "",
      company: useDefaults ? preview.company || "" : "",
      school: useDefaults ? preview.school || "" : "",
      city: useDefaults ? preview.city || "" : "",
      state: useDefaults ? preview.state || "" : "",
      country: useDefaults ? preview.country || "" : "",
      hometown: useDefaults ? preview.hometown || "" : "",
      nationality: useDefaults ? preview.nationality || "" : "",
      fromCity: useDefaults ? preview.fromCity || "" : "",
      fromCountry: useDefaults ? preview.fromCountry || "" : "",
      copyPhotos: false,
      sourceColumnId: "",
    },
  });

  // Watch form values for dependent UI
  const copyPhotos = form.watch("copyPhotos");
  const sourceColumnId = form.watch("sourceColumnId");

  // Reset source column when copy photos is disabled
  useEffect(() => {
    if (!copyPhotos) {
      form.setValue("sourceColumnId", "");
    }
  }, [copyPhotos, form]);

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

  // New mutation for creating column with photos
  const createColumnWithPhotos =
    api.profilePreviews.createColumnWithPhotos.useMutation({
      onSuccess: () => {
        toast.success("Column created with photos successfully!");
        onSuccess?.();
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create column with photos");
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });

  const onSubmit = async (data: CreateColumnFormData) => {
    setIsSubmitting(true);

    const { copyPhotos, sourceColumnId, ...columnData } = data;

    if (copyPhotos && sourceColumnId) {
      // Create column and copy photos
      createColumnWithPhotos.mutate({
        previewId,
        sourceColumnId,
        ...columnData,
      });
    } else {
      // Create column normally
      createColumn.mutate({
        previewId,
        ...columnData,
      });
    }
  };

  const fillWithDefaults = () => {
    form.setValue("firstName", preview.firstName || "");
    form.setValue("gender", preview.gender || undefined);
    form.setValue("age", preview.age || undefined);
    form.setValue("bio", preview.defaultBio || "");
    form.setValue("jobTitle", preview.jobTitle || "");
    form.setValue("company", preview.company || "");
    form.setValue("school", preview.school || "");
    form.setValue("city", preview.city || "");
    form.setValue("state", preview.state || "");
    form.setValue("country", preview.country || "");
    form.setValue("hometown", preview.hometown || "");
    form.setValue("nationality", preview.nationality || "");
    form.setValue("fromCity", preview.fromCity || "");
    form.setValue("fromCountry", preview.fromCountry || "");
    setUseDefaults(true);
  };

  const clearAll = () => {
    form.setValue("label", "");
    form.setValue("firstName", "");
    form.setValue("gender", undefined);
    form.setValue("age", undefined);
    form.setValue("bio", "");
    form.setValue("jobTitle", "");
    form.setValue("company", "");
    form.setValue("school", "");
    form.setValue("city", "");
    form.setValue("state", "");
    form.setValue("country", "");
    form.setValue("hometown", "");
    form.setValue("nationality", "");
    form.setValue("fromCity", "");
    form.setValue("fromCountry", "");
    form.setValue("copyPhotos", false);
    form.setValue("sourceColumnId", "");
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

        {/* Photo Copying Section */}
        {hasExistingPhotos && (
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Copy photos from existing column
                </label>
                <p className="text-sm text-muted-foreground">
                  Start with photos from another profile variation
                </p>
              </div>
              <FormField
                control={form.control}
                name="copyPhotos"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {copyPhotos && (
              <div className="space-y-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="sourceColumnId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Column</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a column to copy photos from" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {existingPreviews?.map((preview) =>
                            preview.columns
                              .filter((col) => col._count.mediaAssets > 0)
                              .map((column) => (
                                <SelectItem key={column.id} value={column.id}>
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {
                                        dataProviderOptions.find(
                                          (opt) => opt.value === column.type,
                                        )?.icon
                                      }
                                    </span>
                                    <span>
                                      {preview.name || "Untitled"} -{" "}
                                      {column.type}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {column._count.mediaAssets} photos
                                    </Badge>
                                  </div>
                                </SelectItem>
                              )),
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Photos will be copied to the new {form.watch("type")}{" "}
                        column
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

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
          <p className="text-sm text-muted-foreground">
            Leave fields blank to use the preview defaults
          </p>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Male</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                      <SelectItem value={Gender.OTHER}>Other</SelectItem>
                      <SelectItem value={Gender.MORE}>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25"
                      {...field}
                      value={field.value || ""}
                    />
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
                    <Input
                      placeholder="New York"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hometown"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hometown</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Where you grew up"
                      {...field}
                      value={field.value || ""}
                    />
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
                    <Input
                      placeholder="Marketing Manager"
                      {...field}
                      value={field.value || ""}
                    />
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
                    <Input
                      placeholder="Acme Inc"
                      {...field}
                      value={field.value || ""}
                    />
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
                    value={field.value || ""}
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
