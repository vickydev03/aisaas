import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/modules/dashboard/ui/component/DashboardSidebar";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="flex  h-screen w-screen bg-muted">
        <DashboardSidebar/>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default Layout;
