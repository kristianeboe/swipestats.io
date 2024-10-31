"use client";

import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const RadioGroupFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  className,
  hideLabel,
  // destructure out props used in the component so they don't get passed down with the rest props
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  hideLabel?: boolean;
  options: { label: string; value: string }[];
}) => {
  return (
    <FormField
      control={control}
      name={name}
      {...props}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {options.map((o) => (
                <FormItem
                  key={o.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={o.value} />
                  </FormControl>
                  <FormLabel className="!mt-0 font-normal">{o.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const StarRatingFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  className,
  hideLabel,
  // destructure out props used in the component so they don't get passed down with the rest props
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  hideLabel?: boolean;
  options: number[];
}) => {
  const [hoverStarRating, setHoverStarRating] = useState<number | null>(null);

  return (
    <FormField
      control={control}
      name={name}
      {...props}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {options.map((rating) => (
              <FormItem key={rating}>
                <FormControl>
                  <StarIcon
                    className={cn(
                      `h-8 w-8 transition-colors`,
                      rating <= field.value && "fill-rose-600",
                      ` ${
                        rating <= (hoverStarRating ?? field.value)
                          ? "text-rose-600 hover:text-rose-200"
                          : "text-gray-400"
                      } cursor-pointer`,
                    )}
                    onMouseEnter={() => setHoverStarRating(rating)}
                    onMouseLeave={() => setHoverStarRating(null)}
                    onClick={() => field.onChange(rating)}
                  />
                </FormControl>
              </FormItem>
            ))}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
