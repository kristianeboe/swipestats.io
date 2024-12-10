import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { cn } from "@/lib/utils";

export function DrawerDialog(props: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent
          className={cn("bg-white", {
            "max-w-sm": props.size === "sm",
            "max-w-md": props.size === "md",
            "max-w-lg": props.size === "lg",
          })}
        >
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      <DrawerContent
        className={cn("h-full max-h-[90vh] bg-white", {
          "max-w-sm": props.size === "sm",
          "max-w-md": props.size === "md",
          "max-w-lg": props.size === "lg",
        })}
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4">{props.children}</ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
