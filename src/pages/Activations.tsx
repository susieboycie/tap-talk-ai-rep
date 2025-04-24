
import { useOutlet } from "@/contexts/outlet-context";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DocumentViewer } from "@/components/dashboard/document-viewer";
import { ConversationStartersGrid } from "@/components/dashboard/conversation-starters-grid";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { useState } from "react";

export default function Activations() {
  const { selectedOutlet } = useOutlet();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);

  const handleConversationStart = (prompt: string) => {
    setAssistantPrompt(prompt);
    setIsAssistantOpen(true);
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Activations</h1>
          <p className="text-gray-400">View and manage activation materials and documents</p>
        </div>
        <div className="w-[240px]">
          <OutletSelector />
        </div>
      </div>
      
      <div className="mb-6">
        <ConversationStartersGrid 
          selectedOutlet={selectedOutlet}
          onConversationStart={handleConversationStart}
        />
      </div>
      
      <div className="space-y-4">
        <DocumentViewer />
      </div>

      <Button 
        className="fixed bottom-4 right-4 z-40 bg-repgpt-400 hover:bg-repgpt-500 text-white shadow-lg"
        onClick={() => {
          setAssistantPrompt(null);
          setIsAssistantOpen(true);
        }}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Ask RepGPT
      </Button>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        selectedOutlet={selectedOutlet || null}
        selectedPersona={null}
        initialMessage={assistantPrompt}
      />
    </DashboardShell>
  );
}
