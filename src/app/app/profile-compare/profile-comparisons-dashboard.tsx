"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { PlusCircle, Trash2, ExternalLink } from "lucide-react";
import { DataProvider } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/app/_components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce
    .number()
    .min(18, { message: "You must be at least 18 years old." })
    .max(100)
    .optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  defaultBio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileComparisonsDashboard() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      city: "",
      state: "",
      country: "",
      defaultBio: "",
    },
  });

  const { data: comparisons, isLoading } =
    api.profileCompare.getComparisons.useQuery();

  const createComparisonMutation =
    api.profileCompare.createComparison.useMutation({
      onSuccess: (data) => {
        toast.success("Comparison created successfully!");
        setIsDialogOpen(false);
        setIsCreating(false);
        form.reset();
        void utils.profileCompare.getComparisons.invalidate();
        router.push(`/app/profile-compare/${data.id}`);
      },
      onError: (error) => {
        toast.error("Failed to create comparison: " + error.message);
        setIsCreating(false);
      },
    });

  const deleteComparisonMutation =
    api.profileCompare.deleteComparison.useMutation({
      onSuccess: () => {
        void utils.profileCompare.getComparisons.invalidate();
        setDeletingId(null);
        toast.success("Comparison deleted successfully!");
      },
    });

  const utils = api.useUtils();

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteComparisonMutation.mutate({ id });
  };

  const onSubmit = (values: FormValues) => {
    setIsCreating(true);

    // Create a new comparison with the form data
    createComparisonMutation.mutate({
      name: values.name,
      age: values.age,
      city: values.city || "",
      state: values.state || "",
      country: values.country || "",
      defaultBio: values.defaultBio || "",
      columns: [], // Start with no columns
    });
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">Loading your saved comparisons...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Profile Comparisons</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Comparison
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Create New Comparison
              </DialogTitle>
              <DialogDescription>
                Fill in details about the profile you want to compare. This
                helps us generate accurate statistics and insights.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Profile Name{" "}
                          <span className="ml-1 text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, 2025" {...field} />
                        </FormControl>
                        <FormDescription>
                          A name to identify this profile in your comparisons.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : parseInt(value),
                                );
                              }}
                              value={field.value ?? ""}
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
                          <FormLabel>City (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="USA" {...field} />
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
                        <FormLabel>Default Bio (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="About me..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The bio displayed on your dating profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Comparison"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {comparisons && comparisons.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comparison) => (
            <Card.Container key={comparison.id}>
              <CardHeader>
                <CardTitle>
                  {comparison.name || "Untitled Comparison"}
                </CardTitle>
                <CardDescription>
                  Created on{" "}
                  {new Date(comparison.createdAt).toLocaleDateString()}
                  {comparison.age && <> • Age: {comparison.age}</>}
                  {comparison.city && <> • {comparison.city}</>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {comparison.columns.map((column) => (
                    <div
                      key={column.id}
                      className="rounded-full px-3 py-1 text-xs text-white"
                      style={{
                        backgroundColor: getAppColor(column.type),
                      }}
                    >
                      {column.type}
                    </div>
                  ))}
                  {comparison.columns.length === 0 && (
                    <div className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                      No apps added yet
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {comparison.columns.reduce(
                    (total, column) => total + column.photos.length,
                    0,
                  )}{" "}
                  photos · {comparison.isPublic ? "Public" : "Private"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(comparison.id)}
                  disabled={
                    deleteComparisonMutation.isPending &&
                    deletingId === comparison.id
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Link href={`/app/profile-compare/${comparison.id}`} passHref>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card.Container>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">
            You haven&apos;t created any comparisons yet.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Comparison
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to get app color
function getAppColor(appType: DataProvider): string {
  switch (appType) {
    case DataProvider.TINDER:
      return "#FF6B6B";
    case DataProvider.HINGE:
      return "#FF85A1";
    case DataProvider.BUMBLE:
      return "#FFD166";
    case DataProvider.GRINDER:
      return "#FF9F1C";
    case DataProvider.BADOO:
      return "#9381FF";
    case DataProvider.BOO:
      return "#4EA8DE";
    case DataProvider.OK_CUPID:
      return "#06D6A0";
    case DataProvider.FEELD:
      return "#748CAB";
    default:
      return "#CCCCCC";
  }
}
