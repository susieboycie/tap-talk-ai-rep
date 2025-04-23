
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Only render the assistant button on specific pages, not the login page
  const shouldShowAssistant = !location.pathname.includes("login");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-repgpt-800 text-white">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {user && shouldShowAssistant && (
            <Button
              className="fixed bottom-4 right-4 z-40 bg-repgpt-400 hover:bg-repgpt-500 text-white"
              onClick={() => setIsAssistantOpen(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask RepGPT
            </Button>
          )}
          <Outlet />
          {shouldShowAssistant && (
            <AIAssistant
              isOpen={isAssistantOpen}
              onClose={() => setIsAssistantOpen(false)}
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
