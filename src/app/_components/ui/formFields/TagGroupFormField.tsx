import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

import { Checkbox, CheckboxTag, TagBadge } from "../checkbox";

export const TagGroupFormField = <
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
          <div className="mb-4">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const value = field.value as string[];

              return (
                <FormField
                  key={option.value}
                  control={control}
                  name={name}
                  render={({}) => {
                    return (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <>
                            {/* <CheckboxTag
                        checked={value.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...value, option.value])
                            : field.onChange(
                                value.filter(
                                  (value) => value !== option.value,
                                ),
                              );
                        }}
                      /> */}
                            <TagBadge
                              label={option.label}
                              checked={value.includes(option.value)}
                              onChange={(checked) => {
                                return checked
                                  ? field.onChange([...value, option.value])
                                  : field.onChange(
                                      value.filter(
                                        (value) => value !== option.value,
                                      ),
                                    );
                              }}
                            />
                          </>
                        </FormControl>
                        {/* <FormLabel className="font-normal">
                    {option.label}
                  </FormLabel> */}
                      </FormItem>
                    );
                  }}
                />
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
