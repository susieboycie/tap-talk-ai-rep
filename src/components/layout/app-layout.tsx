
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/contexts/auth-context";

export function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-repgpt-800 text-white">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
