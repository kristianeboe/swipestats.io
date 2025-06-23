"use client";

import { cn } from "@/lib/utils";

import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { isValidElement, useState } from "react";
import { ScrollArea } from "../scroll-area";

interface ResponsiveDialogProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  trigger?: React.ReactNode; // is optional because the children can also house a more controlled trigger
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  scrollable?: boolean;
}

export function ResponsiveDialog({
  children,
  title,
  description,
  trigger,
  open,
  onOpenChange,
  className,
  showFooter = false,
  footerContent,
  scrollable = false,
}: ResponsiveDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Use controlled or uncontrolled state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  // If children are provided, use them directly
  // Otherwise, use title/description structure
  const hasStructuredContent =
    !isValidElement(children) || title || description;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={cn("sm:max-w-[425px]", className)}>
          {hasStructuredContent && (title || description) ? (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          ) : null}
          {scrollable ? (
            <ScrollArea className="max-h-[80vh] pr-4">{children}</ScrollArea>
          ) : (
            children
          )}
          {showFooter && (
            <div className="flex w-full items-center justify-end gap-2 pt-4">
              {footerContent || (
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={className}>
        {hasStructuredContent && (title || description) ? (
          <DrawerHeader className="text-left">
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        ) : null}
        {scrollable ? (
          <ScrollArea className="max-h-[70vh] px-4">{children}</ScrollArea>
        ) : (
          <div className="px-4">{children}</div>
        )}
        {showFooter && (
          <DrawerFooter className="pt-2">
            {footerContent || (
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

// Demo component showing how to use the ResponsiveDialog
function _ResponsiveDialogDemo() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      showFooter={true}
      trigger={<Button variant="outline">Edit Profile</Button>}
    >
      <ProfileForm />
    </ResponsiveDialog>
  );
}

// Example form component for the demo
function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          defaultValue="shadcn@example.com"
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="grid gap-3">
        <label
          htmlFor="username"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Username
        </label>
        <input
          id="username"
          defaultValue="@shadcn"
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
