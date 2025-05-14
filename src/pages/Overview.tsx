
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useOutletSalesData } from "@/hooks/use-outlet-sales-data";
import { usePersonaDetails, type PersonaDetails } from "@/hooks/use-persona-details";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { PersonaSelector } from "@/components/dashboard/persona-selector";
import ConversationStartersGrid from "@/components/dashboard/conversation-starters-grid";
import { supabase } from "@/integrations/supabase/client";
import { OutletOverview } from "@/components/dashboard/outlet-overview";
import { useOutlet } from "@/contexts/outlet-context";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const { user } = useAuth();
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);
  const [manualPersonaDetails, setManualPersonaDetails] = useState<PersonaDetails | null>(null);
  const navigate = useNavigate();

  const { 
    personaDetails: outletPersonaDetails, 
    clusterType, 
    clusterDetails,
    isLoading: isPersonaLoading 
  } = usePersonaDetails(selectedOutlet);
  
  const { data: salesData, isLoading: isSalesLoading } = useOutletSalesData(selectedOutlet);
  
  // We now only use one data source
  const isCombinedDataLoading = isSalesLoading;

  useEffect(() => {
    if (outletPersonaDetails && !selectedPersona) {
      setSelectedPersona(outletPersonaDetails.name);
    }
  }, [outletPersonaDetails, selectedPersona]);

  useEffect(() => {
    if (selectedPersona && selectedPersona !== outletPersonaDetails?.name) {
      const fetchPersonaDetails = async () => {
        const { data, error } = await supabase
          .from('persona_details')
          .select('*')
          .eq('name', selectedPersona)
          .limit(1);
        
        if (error) {
          console.error("Error fetching manual persona details:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setManualPersonaDetails(data[0] as PersonaDetails);
        }
      };
      
      fetchPersonaDetails();
    } else if (outletPersonaDetails) {
      setManualPersonaDetails(null);
    }
  }, [selectedPersona, outletPersonaDetails]);

  const effectivePersonaDetails = manualPersonaDetails || outletPersonaDetails;

  const handleConversationStart = (prompt: string) => {
    let enhancedPrompt = prompt;
    
    if (effectivePersonaDetails) {
      enhancedPrompt = `${prompt}\n\nContext: This outlet "${selectedOutlet}" corresponds to a "${effectivePersonaDetails.name}" persona. They have these goals: "${effectivePersonaDetails.goals}" and these pain points: "${effectivePersonaDetails.pain_points}".`;
    }
    
    setAssistantPrompt(enhancedPrompt);
    setIsAssistantOpen(true);
  };

  // Adapt the sales data for components that still expect the daily_sales_volume structure
  const adaptedSalesData = salesData ? salesData.map(item => ({
    ...item,
    Calendar_Year: new Date(item.Calendar_day || "").getFullYear(),
    Cluster: clusterType || "",
    Country: "Ireland", // Default value
    Outlet: item["Outlet Name"] || "",
    prim_key: 0 // Default value
  })) : [];

  // Using only the salesData for simplicity
  const hasSalesData = salesData && salesData.length > 0;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">RepGPT</h1>
          <p className="text-gray-400">
            I am RepGPT - your personalised AI driven sales assistant! I can help by providing you with relevant Outlet specific insights, tailored talking points for activation plans, and smart suggestions that help you make every conversation count.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
        <div className="md:col-span-2 lg:col-span-3">
          <OutletSelector />
        </div>
        <div>
          <PersonaSelector
            selectedPersona={selectedPersona}
            onPersonaChange={setSelectedPersona}
          />
        </div>
      </div>

      <div className="mb-6">
        <OutletOverview 
          outletName={selectedOutlet}
          cluster={clusterType}
          clusterDetails={clusterDetails}
          personaDetails={effectivePersonaDetails}
          salesData={adaptedSalesData}
          isLoading={isPersonaLoading && !manualPersonaDetails}
          salesDataLoading={isSalesLoading}
        />
      </div>

      <ConversationStartersGrid 
        selectedOutlet={selectedOutlet}
        onConversationStart={handleConversationStart}
      />

      <Button 
        className="fixed bottom-4 right-4 z-40 bg-repgpt-400 hover:bg-repgpt-500 text-white shadow-lg"
        onClick={() => navigate('/ask-repgpt')}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Ask RepGPT
      </Button>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        selectedOutlet={selectedOutlet || null}
        selectedPersona={effectivePersonaDetails?.name || null}
        initialMessage={assistantPrompt}
      />
    </DashboardShell>
  );
}
