import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { OutletDescription } from "@/components/dashboard/outlet-description";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConversationStarter } from "@/components/repgpt/conversation-starter";
import { MessageSquare } from "lucide-react";
import { Insights, Partnership, Quality } from "@/components/icons";
import { useAuth } from "@/contexts/auth-context";
import { useOutletSales } from "@/hooks/use-outlet-sales";
import { usePersonaDetails, type PersonaDetails } from "@/hooks/use-persona-details";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Personas data
const personas = [
  { id: "entrepreneur", name: "The Entrepreneur" },
  { id: "deal-maker", name: "The Deal Maker" },
  { id: "pragmatist", name: "The Pragmatist" },
  { id: "support-seeker", name: "The Support Seeker" }
] as const;

export default function Dashboard() {
  const { user } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);
  const [manualPersonaDetails, setManualPersonaDetails] = useState<PersonaDetails | null>(null);

  // Query to fetch unique outlet names
  const { data: outletNames } = useQuery({
    queryKey: ['outlet-names'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_sales_volume')
        .select('Outlet')
        .not('Outlet', 'is', null)
        .order('Outlet');
        
      if (error) {
        console.error("Error fetching outlet names:", error);
        throw error;
      }

      // Get unique outlet names
      const uniqueOutlets = Array.from(new Set(data.map(row => row.Outlet))) as string[];
      console.log("Fetched unique outlets:", uniqueOutlets);
      return uniqueOutlets.filter(Boolean);
    }
  });

  // Get persona details based on outlet's cluster
  const { 
    personaDetails: outletPersonaDetails, 
    clusterType, 
    clusterDetails,
    isLoading: isPersonaLoading 
  } = usePersonaDetails(selectedOutlet);
  
  // When persona data loads from cluster, update the selected persona
  // Only do this if the user hasn't manually selected a persona
  useEffect(() => {
    if (outletPersonaDetails && !selectedPersona) {
      setSelectedPersona(outletPersonaDetails.name);
    }
  }, [outletPersonaDetails, selectedPersona]);

  // Fetch selected persona details when manually selected
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
      setManualPersonaDetails(null); // Reset manual selection if we're using outlet's persona
    }
  }, [selectedPersona, outletPersonaDetails]);

  // Get the effective persona details (either manually selected or from outlet)
  const effectivePersonaDetails = manualPersonaDetails || outletPersonaDetails;

  const handlePersonaSelect = (personaName: string) => {
    setSelectedPersona(personaName);
  };

  const handleConversationStart = (prompt: string) => {
    let enhancedPrompt = prompt;
    
    if (effectivePersonaDetails) {
      enhancedPrompt = `${prompt}\n\nContext: This outlet "${selectedOutlet}" corresponds to a "${effectivePersonaDetails.name}" persona. They have these goals: "${effectivePersonaDetails.goals}" and these pain points: "${effectivePersonaDetails.pain_points}".`;
    }
    
    setAssistantPrompt(enhancedPrompt);
    setIsAssistantOpen(true);
  };

  // Fetch sales data for selected outlet
  const { data: salesData, isLoading: isSalesLoading } = useOutletSales(selectedOutlet);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">RepGPT</h1>
          <p className="text-gray-400">
            Your AI sales assistant, {user?.name}
          </p>
        </div>
      </div>

      {/* Outlet Search + Persona Selection */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
        <div className="md:col-span-2 lg:col-span-3">
          <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
            <SelectTrigger className="border-repgpt-600 bg-repgpt-700 text-white">
              <SelectValue placeholder="Select an outlet" />
            </SelectTrigger>
            <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
              {outletNames?.map((outlet) => (
                <SelectItem key={outlet} value={outlet}>
                  {outlet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={selectedPersona} onValueChange={handlePersonaSelect}>
            <SelectTrigger className="border-repgpt-600 bg-repgpt-700 text-white">
              <SelectValue placeholder="Select Persona" />
            </SelectTrigger>
            <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
              {personas.map((persona) => (
                <SelectItem key={persona.id} value={persona.name}>
                  {persona.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Outlet Description Section */}
      <div className="mb-6">
        <OutletDescription 
          outletName={selectedOutlet}
          cluster={clusterType}
          clusterDetails={clusterDetails}
          personaDetails={effectivePersonaDetails}
          salesData={salesData}
          isLoading={isPersonaLoading && !manualPersonaDetails}
        />
      </div>

      {/* Conversation Starter Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <ConversationStarter
          icon={<MessageSquare className="h-5 w-5 text-purple-400" />}
          title="Activations"
          description="Help you sell and activate"
          examples={[
            `Key EPL deck points for ${selectedOutlet || "outlet"}`,
            `Tailor pitch for ${selectedOutlet || "client"}`
          ]}
          color="border-purple-500"
          onClick={handleConversationStart}
        />
        
        <ConversationStarter
          icon={<Insights className="h-5 w-5 text-blue-400" />}
          title="Insights"
          description="Insights tailored to your client"
          examples={[
            "Smirnoff vs Absolut in Dublin",
            `Non-Diageo draught in ${selectedOutlet || "outlet"}`
          ]}
          color="border-blue-500"
          onClick={handleConversationStart}
        />
        
        <ConversationStarter
          icon={<Partnership className="h-5 w-5 text-green-400" />}
          title="Partnership"
          description="Manage contracts & volumes"
          examples={[
            `Guinness volume for ${selectedOutlet || "outlet"}`,
            `${selectedOutlet || "Outlet"} order history`
          ]}
          color="border-green-500"
          onClick={handleConversationStart}
        />
        
        <ConversationStarter
          icon={<Quality className="h-5 w-5 text-amber-400" />}
          title="Quality"
          description="Ensure highest quality"
          examples={[
            "Guinness 0.0 install requirements",
            `Diageo taps at ${selectedOutlet || "outlet"}`
          ]}
          color="border-amber-500"
          onClick={handleConversationStart}
        />
      </div>

      {/* Performance Chart */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
        <div className="md:col-span-2 lg:col-span-3">
          <PerformanceChart data={salesData} isLoading={isSalesLoading} />
        </div>
      </div>

      {/* Floating AI Assistant Button */}
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

      {/* AI Assistant Modal */}
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
