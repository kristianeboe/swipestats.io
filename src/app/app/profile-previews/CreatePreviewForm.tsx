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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { api, type RouterInputs } from "@/trpc/react";
import { toast } from "sonner";

const createPreviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  public: z.boolean().default(false),
  // Default profile info
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  age: z.coerce.number().optional(),
  defaultBio: z.string().optional(),
  fromCity: z.string().optional(),
  fromCountry: z.string().optional(),
});

// Use RouterInputs for consistency with tRPC types
type CreatePreviewForm = RouterInputs["profilePreviews"]["create"];

interface CreatePreviewFormProps {
  onSuccess?: (previewId: string) => void;
  onCancel?: () => void;
}

export function CreatePreviewForm({
  onSuccess,
  onCancel,
}: CreatePreviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePreviewForm>({
    resolver: zodResolver(createPreviewSchema),
    defaultValues: {
      name: "",
      description: "",
      public: false,
      jobTitle: "",
      company: "",
      school: "",
      city: "",
      state: "",
      country: "",
      age: undefined,
      defaultBio: "",
      fromCity: "",
      fromCountry: "",
    },
  });

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

  const onSubmit = async (data: CreatePreviewForm) => {
    setIsSubmitting(true);
    createPreview.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My awesome profile test..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are you testing with this preview?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional description of what you&apos;re testing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Default Profile Information - Collapsible */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="defaults">
            <AccordionTrigger>
              <span className="text-sm font-medium">
                Default Profile Information
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <p className="text-muted-foreground text-sm">
                  This information will be used across all columns unless
                  overridden
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

                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <FormControl>
                          <Input placeholder="State University" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
