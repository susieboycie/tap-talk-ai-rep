
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChart, Home, FileText, BarChart3, Users, Shield, MessageSquare, ClipboardList, ChartBar } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-r border-repgpt-700">
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="bg-repgpt-400 rounded-md p-1">
            <BarChart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">RepGPT AI</h1>
        </div>
        <SidebarTrigger className="h-8 w-8" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-repgpt-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className={`flex items-center gap-2 ${currentPath === "/" ? "text-repgpt-400" : ""}`}>
                    <Home className="h-4 w-4" />
                    <span>RepGPT Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/ask-repgpt" className={`flex items-center gap-2 ${currentPath === "/ask-repgpt" ? "text-repgpt-400" : ""}`}>
                    <MessageSquare className="h-4 w-4" />
                    <span>Ask RepGPT</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/notes-to-actions" className={`flex items-center gap-2 ${currentPath === "/notes-to-actions" ? "text-repgpt-400" : ""}`}>
                    <ClipboardList className="h-4 w-4" />
                    <span>Notes to Actions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/outlet-actions-insights" className={`flex items-center gap-2 ${currentPath === "/outlet-actions-insights" ? "text-repgpt-400" : ""}`}>
                    <ChartBar className="h-4 w-4" />
                    <span>Actions Insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/activations" className={`flex items-center gap-2 ${currentPath === "/activations" ? "text-repgpt-400" : ""}`}>
                    <FileText className="h-4 w-4" />
                    <span>Activations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/insights" className={`flex items-center gap-2 ${currentPath === "/insights" ? "text-repgpt-400" : ""}`}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/partnerships" className={`flex items-center gap-2 ${currentPath === "/partnerships" ? "text-repgpt-400" : ""}`}>
                    <Users className="h-4 w-4" />
                    <span>Partnerships</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/quality" className={`flex items-center gap-2 ${currentPath === "/quality" ? "text-repgpt-400" : ""}`}>
                    <Shield className="h-4 w-4" />
                    <span>Quality</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
