"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import DashboardUserButton from "./DashboardUserButton";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Hello",
    href: "/hello",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];
const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

function DashboardSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground ">
        <Link href={"/"} className="flex items-center gap-2 px-2 pt-2 ">
          <Image src={"/logo.svg"} height={36} width={36} alt="Hello.ai" />
          <p className="font-semibold">Hello ai</p>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <SidebarSeparator />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((e) => (
                <SidebarMenuItem key={e.label}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:[#5d6b68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathName === e.href &&
                        "bg-linear-to-r/oklch border-[#5d6b68]/10"
                    )}
                    isActive={pathName === e.href}
                  >
                    <Link href={e.href}>
                      <e.icon className="size-5" />
                      <span className="text-sm tracking-tight font-semibold">
                        {e.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2">
          <SidebarSeparator />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((e) => (
                <SidebarMenuItem key={e.label}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:[#5d6b68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathName === e.href &&
                        "bg-linear-to-r/oklch border-[#5d6b68]/10"
                    )}
                    isActive={pathName === e.href}
                  >
                    <Link href={e.href}>
                      <e.icon className="size-5" />
                      <span className="text-sm tracking-tight font-semibold">
                        {e.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardUserButton/>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;
