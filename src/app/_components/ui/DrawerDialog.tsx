import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
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
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description?: string;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={props.open} onOpenChange={props.setOpen}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent
          className={cn("bg-white", {
            "max-w-sm": props.size === "sm",
            "max-w-md": props.size === "md",
            "max-w-lg": props.size === "lg",
            "max-w-2xl": props.size === "2xl",
            "max-w-3xl": props.size === "3xl",
            "max-w-4xl": props.size === "4xl",
            "max-w-5xl": props.size === "5xl",
            "max-w-6xl": props.size === "6xl",
            "max-w-7xl": props.size === "7xl",
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
    <Drawer open={props.open} onOpenChange={props.setOpen}>
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
