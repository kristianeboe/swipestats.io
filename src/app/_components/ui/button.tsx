import * as React from "react";
import { Loader2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-rose-950 dark:focus-visible:ring-rose-300",
  {
    variants: {
      variant: {
        default:
          "bg-rose-600 text-rose-50 hover:bg-rose-700/90 dark:bg-rose-50 dark:text-rose-700 dark:hover:bg-rose-50/90",
        destructive:
          "bg-red-500 text-rose-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-rose-50 dark:hover:bg-red-900/90",
        outline:
          "border border-rose-200 bg-white hover:bg-rose-100 hover:text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:hover:bg-rose-800 dark:hover:text-rose-50",
        secondary:
          "bg-rose-100 text-rose-900 hover:bg-rose-100/80 dark:bg-rose-800 dark:text-rose-50 dark:hover:bg-rose-800/80",
        ghost:
          "hover:bg-rose-100 hover:text-rose-900 dark:hover:bg-rose-800 dark:hover:text-rose-50",
        link: "text-rose-900 underline-offset-4 hover:underline dark:text-rose-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      loading: {
        true: "opacity-75 pointer-events-none", // Style adjustments for loading state
        false: "",
      },
      fluid: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean; // Adding loading state prop
  fluid?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      fluid = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, loading, className, fluid }),
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
