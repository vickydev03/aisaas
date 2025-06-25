import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
// import { useIsMobile } from "@/hooks/use-mobile";
// import {
//   Drawer,
//   DrawerDescription,
//   DrawerHeader,
//   DrawerTitle,
// } from "./ui/drawer";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function ResponsiveDialog({
  title,
  description,
  children,
  onOpenChange,
  open,
}: Props) {

  // const isMobile = useIsMobile();
  // if (isMobile) {
  //  return <Drawer open={open} onOpenChange={onOpenChange}>
  //     <DrawerHeader>
  //       <DrawerTitle>{title}</DrawerTitle>
  //       <DrawerDescription>{description}</DrawerDescription>
  //     </DrawerHeader>
  //     <div className="p-4 ">{children}</div>
  //   </Drawer>;
  // }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>;
}

export default ResponsiveDialog;
