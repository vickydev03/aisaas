"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GenerateAvartar from "@/components/GenerateAvatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
function DashboardUserButton() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  if (!data?.user || isPending) {
    return null;
  }
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="rouned-lg border border-border/10 p-3 w-full flex items-center justify-between  bg-white/5 hover:bg-white/10 overflwo-hidden">
          {data.user.image ? (
            <Avatar>
              <AvatarImage src={data.user.image} alt="user" />
              <AvatarFallback>{data.user?.name}</AvatarFallback>
            </Avatar>
          ) : (
            <GenerateAvartar
              seed={data.user.name}
              className="size-9 mr-3 "
              variant="botttsNeutral"
            />
          )}
          <div className="flex flex-col text-left gap-0.5 overflow-hidden flex-1 min-w-0 ">
            <p className="text-sm truncate w-full">{data.user.name}</p>
            <p className="text-xs truncate w-full">{data.user.email}</p>
          </div>
          <ChevronDownIcon className="size-4  shrink-0" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              variant={"outline"}
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button variant={"outline"} onClick={handleLogout}>
              <LogOutIcon className="size-4 text-black" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rouned-lg border border-border/10 p-3 w-full flex items-center justify-between  bg-white/5 hover:bg-white/10 overflwo-hidden">
        {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} alt="user" />
            <AvatarFallback>{data.user?.name}</AvatarFallback>
          </Avatar>
        ) : (
          <GenerateAvartar
            seed={data.user.name}
            className="size-9 mr-3 "
            variant="botttsNeutral"
          />
        )}
        <div className="flex flex-col text-left gap-0.5 overflow-hidden flex-1 min-w-0 ">
          <p className="text-sm truncate w-full">{data.user.name}</p>
          <p className="text-xs truncate w-full">{data.user.email}</p>
        </div>
        <ChevronDownIcon className="size-4  shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="font-normal truncate text-sm text-muted-foreground   ">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => authClient.customer.portal()}
          className="flex justify-between items-center cursor-pointer"
        >
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between items-center cursor-pointer"
          onClick={handleLogout}
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DashboardUserButton;
