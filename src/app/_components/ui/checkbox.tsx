"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const CheckboxTag = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
CheckboxTag.displayName = CheckboxPrimitive.Root.displayName;

const TagBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label: string;
  }
>(({ className, checked = false, onChange, label, ...props }, ref) => {
  const handleClick = () => {
    onChange?.(!checked);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "text-sm",
        "inline-flex cursor-pointer select-none items-center justify-center rounded-full px-3 py-1",
        checked
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors duration-200",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="">{label}</span>
      {/* {checked && <Check className="h-4 w-4" />} */}
    </div>
  );
});

TagBadge.displayName = "TagBadge";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export function CheckboxWithLabel(props: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("items-top flex space-x-2", props.className)}>
      <Checkbox
        id={props.id}
        checked={props.checked}
        onCheckedChange={props.onChange}
        disabled={props.disabled}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {props.label}
        </label>
        {props.description && (
          <p className="text-muted-foreground text-sm">{props.description}</p>
        )}
      </div>
    </div>
  );
}

export { Checkbox, CheckboxTag, TagBadge };
