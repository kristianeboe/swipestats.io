"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gender, DataProvider } from "@prisma/client";
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
import { Switch } from "@/app/_components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  CountryDropdown,
  RegionSelect,
} from "@/app/_components/ui/compound/CountryRegionSelect";
import { api, type RouterInputs } from "@/trpc/react";
import { toast } from "sonner";
import { Badge } from "@/app/_components/ui/badge";

const createPreviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  public: z.boolean().optional(),
  // Basic info
  gender: z.nativeEnum(Gender).optional(),
  age: z.coerce.number().optional(),
  heightCm: z.coerce.number().optional(),
  defaultBio: z.string().optional(),
  // Work & Education
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  school: z.string().optional(),
  // Location
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  nationality: z.string().optional(),
  hometown: z.string().optional(),
  fromCity: z.string().optional(),
  fromCountry: z.string().optional(),
  // Photo copying
  copyPhotos: z.boolean().optional(),
  sourceColumnId: z.string().optional(),
  targetColumnTypes: z.array(z.nativeEnum(DataProvider)).optional(),
});

// Create a form type that includes copyPhotos since it's not in RouterInputs yet
type CreatePreviewFormData = z.infer<typeof createPreviewSchema>;

// Transform to RouterInputs for submission (excluding copyPhotos)
type CreatePreviewSubmission = RouterInputs["profilePreviews"]["create"];

interface CreatePreviewFormProps {
  onSuccess?: (previewId: string) => void;
  onCancel?: () => void;
}

// Move priority options outside component to prevent re-creation on every render
const PRIORITY_COUNTRIES = ["US", "NO", "CA", "GB", "AU", "DE", "FR"];

// Dating app options
// TODO consolidate
const DATA_PROVIDER_OPTIONS = [
  { value: DataProvider.TINDER, label: "🔥 Tinder", icon: "🔥" },
  { value: DataProvider.HINGE, label: "🔒 Hinge", icon: "🔒" },
  { value: DataProvider.BUMBLE, label: "🐝 Bumble", icon: "🐝" },
  { value: DataProvider.GRINDER, label: "🟡 Grindr", icon: "🟡" },
  { value: DataProvider.BADOO, label: "💜 Badoo", icon: "💜" },
  { value: DataProvider.OK_CUPID, label: "💙 OkCupid", icon: "💙" },
  { value: DataProvider.FEELD, label: "🌈 Feeld", icon: "🌈" },
  { value: DataProvider.RAYA, label: "💎 Raya", icon: "💎" },
];

// Helper function to get current month and year
const getCurrentMonthYear = () => {
  const now = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
};

export function CreatePreviewForm({
  onSuccess,
  onCancel,
}: CreatePreviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Separate UI state for toggles
  const [showAdvancedLocation, setShowAdvancedLocation] = useState(false);

  // Get current user data for prefilling
  const { data: userData } = api.user.getCurrentUser.useQuery();

  // Get existing previews for photo copying
  const { data: existingPreviews } =
    api.profilePreviews.getAllForDropdown.useQuery();

  // Check if user has any existing previews with photos
  const hasExistingPhotos =
    existingPreviews?.some((preview) =>
      preview.columns.some((column) => column._count.mediaAssets > 0),
    ) ?? false;

  const defaultValues = useMemo(
    () => ({
      name: "",
      public: false,
      // Basic info
      gender: undefined as Gender | undefined,
      age: undefined,
      heightCm: undefined,
      defaultBio: "",
      // Work & Education
      jobTitle: "",
      company: "",
      school: "",
      // Location
      country: userData?.country || "",
      city: userData?.city || "",
      state: "",
      nationality: userData?.nationality || userData?.country || "",
      hometown: userData?.hometown || userData?.city || "",
      fromCity: "",
      fromCountry: "",
      // Photo copying
      copyPhotos: false,
      sourceColumnId: "",
      targetColumnTypes: [] as DataProvider[],
    }),
    [userData],
  );

  const form = useForm<CreatePreviewFormData>({
    resolver: zodResolver(createPreviewSchema),
    defaultValues,
  });

  // Reset form with user data when it becomes available
  useEffect(() => {
    if (userData) {
      form.reset(defaultValues);
    }
  }, [userData, defaultValues, form]);

  // Watch form values for dependent dropdowns
  const currentCountry = form.watch("country");
  const currentCity = form.watch("city");
  const copyPhotos = form.watch("copyPhotos");
  const selectedSourcePreviewId = form.watch("sourceColumnId")?.split(":")[0]; // Extract preview ID
  const sourceColumnId = form.watch("sourceColumnId");
  const targetColumnTypes = form.watch("targetColumnTypes");

  // Auto-update nationality and hometown when country/city changes (if advanced location is off)
  useEffect(() => {
    if (!showAdvancedLocation) {
      if (currentCountry && form.getValues("nationality") !== currentCountry) {
        form.setValue("nationality", currentCountry);
      }
      if (currentCity && form.getValues("hometown") !== currentCity) {
        form.setValue("hometown", currentCity);
      }
    }
  }, [currentCountry, currentCity, showAdvancedLocation, form]);

  // Reset source column when copy photos is disabled
  useEffect(() => {
    if (!copyPhotos) {
      form.setValue("sourceColumnId", "");
      form.setValue("targetColumnTypes", []);
    }
  }, [copyPhotos, form]);

  // Get available columns for the selected preview
  const availableColumns = useMemo(() => {
    if (!selectedSourcePreviewId || !existingPreviews) return [];
    const preview = existingPreviews.find(
      (p) => p.id === selectedSourcePreviewId,
    );
    return preview?.columns.filter((col) => col._count.mediaAssets > 0) || [];
  }, [selectedSourcePreviewId, existingPreviews]);

  const createPreview = api.profilePreviews.create.useMutation({
    onSuccess: (data) => {
      toast.success("Profile preview created successfully!");
      onSuccess?.(data.id);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create profile preview");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Mutation to update user location data
  const updateUser = api.user.updateLocation.useMutation({
    onError: (error) => {
      console.error("Failed to update user location:", error);
    },
  });

  const onSubmit = async (data: CreatePreviewFormData) => {
    setIsSubmitting(true);

    // Update user location data if it has changed
    const locationData = {
      country: data.country,
      city: data.city,
      hometown: data.hometown,
      nationality: data.nationality,
    };

    // Only update if there are actual values and they differ from current user data
    if (
      Object.values(locationData).some((value) => value && value.trim() !== "")
    ) {
      updateUser.mutate(locationData);
    }

    // Prepare the submission data - exclude copyPhotos and transform others
    const submissionData: CreatePreviewSubmission = {
      name: data.name,
      public: data.public,
      gender: data.gender,
      age: data.age,
      heightCm: data.heightCm,
      defaultBio: data.defaultBio,
      jobTitle: data.jobTitle,
      company: data.company,
      school: data.school,
      country: data.country,
      city: data.city,
      state: data.state,
      nationality: data.nationality,
      hometown: data.hometown,
      fromCity: data.fromCity,
      fromCountry: data.fromCountry,
      // Only include photo copying fields if enabled and extract column ID
      sourceColumnId:
        data.copyPhotos && data.sourceColumnId
          ? data.sourceColumnId.split(":")[1] // Extract column ID from "previewId:columnId"
          : undefined,
      targetColumnTypes: data.copyPhotos ? data.targetColumnTypes : undefined,
    };

    createPreview.mutate(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={getCurrentMonthYear()} {...field} />
              </FormControl>
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
                  Copy photos from existing profile
                </label>
                <p className="text-sm text-muted-foreground">
                  Start with photos from an existing profile variation
                </p>
              </div>
              <FormField
                control={form.control}
                name="copyPhotos"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
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
                      <FormLabel>Source Profile & Column</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a profile column to copy from" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {existingPreviews?.map((preview) =>
                            preview.columns
                              .filter((col) => col._count.mediaAssets > 0)
                              .map((column) => (
                                <SelectItem
                                  key={column.id}
                                  value={`${preview.id}:${column.id}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {
                                        DATA_PROVIDER_OPTIONS.find(
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
                        Choose which profile column to copy photos from
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {sourceColumnId && (
                  <FormField
                    control={form.control}
                    name="targetColumnTypes"
                    render={() => (
                      <FormItem>
                        <FormLabel>Create columns for these apps</FormLabel>
                        <FormDescription>
                          Select which dating app columns to create with the
                          copied photos
                        </FormDescription>
                        <div className="grid grid-cols-2 gap-3">
                          {DATA_PROVIDER_OPTIONS.map((option) => (
                            <FormField
                              key={option.value}
                              control={form.control}
                              name="targetColumnTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          option.value,
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                option.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== option.value,
                                                ) || [],
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
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
              name="heightCm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="175"
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
            name="defaultBio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Love exploring new places, trying different cuisines, and having great conversations..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Work & Education */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Work & Education</h3>
          <div className="grid grid-cols-2 gap-4">
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
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Input
                    placeholder="State University"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <CountryDropdown
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        setSelectedCountry(value);
                        // Reset state when country changes
                        form.setValue("state", "");
                      }}
                      placeholder="Select country"
                      priorityOptions={PRIORITY_COUNTRIES}
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
                      placeholder="San Francisco"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Advanced Location Switch */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Different nationality or hometown
              </label>
              <p className="text-sm text-muted-foreground">
                Show nationality and hometown fields if different from country
                and city
              </p>
            </div>
            <Switch
              checked={showAdvancedLocation}
              onCheckedChange={setShowAdvancedLocation}
            />
          </div>

          {/* Advanced Location Fields */}
          {showAdvancedLocation && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <CountryDropdown
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Select nationality"
                        priorityOptions={PRIORITY_COUNTRIES}
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
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Preview"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
