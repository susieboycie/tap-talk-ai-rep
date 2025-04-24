import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { OutletDescription } from "@/components/dashboard/outlet-description";
import { AIAssistant } from "@/components/ai-assistant";
import { QualityKPICard } from "@/components/quality/quality-kpi-card";
import { Button } from "@/components/ui/button";
import { MessageSquare, PhoneCall, CalendarDays, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useOutletSales } from "@/hooks/use-outlet-sales";
import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { usePersonaDetails, type PersonaDetails } from "@/hooks/use-persona-details";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { PersonaSelector } from "@/components/dashboard/persona-selector";
import { ConversationStartersGrid } from "@/components/dashboard/conversation-starters-grid";
import { DocumentViewer } from "@/components/dashboard/document-viewer";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);
  const [manualPersonaDetails, setManualPersonaDetails] = useState<PersonaDetails | null>(null);

  const { 
    personaDetails: outletPersonaDetails, 
    clusterType, 
    clusterDetails,
    isLoading: isPersonaLoading 
  } = usePersonaDetails(selectedOutlet);
  
  const { metrics, getRAGStatus } = useQualityMetrics(selectedOutlet);
  const { data: salesData, isLoading: isSalesLoading } = useOutletSales(selectedOutlet);

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

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
        <div className="md:col-span-2 lg:col-span-3">
          <OutletSelector 
            selectedOutlet={selectedOutlet}
            onOutletChange={setSelectedOutlet}
          />
        </div>
        <div>
          <PersonaSelector
            selectedPersona={selectedPersona}
            onPersonaChange={setSelectedPersona}
          />
        </div>
      </div>

      {selectedOutlet && (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <QualityKPICard
            title="Call Compliance"
            subtitle="In last 8 weeks rolling"
            value={`${metrics.callCompliance}%`}
            icon={ShieldCheck}
            status={getRAGStatus(metrics.callCompliance, "callCompliance")}
          />
          <QualityKPICard
            title="Calls per Day"
            subtitle="Physical calls in last 8 weeks rolling"
            value={metrics.callsPerDay.toFixed(1)}
            target={metrics.cpdTarget}
            icon={PhoneCall}
            status={getRAGStatus(metrics.callsPerDay, "callsPerDay")}
          />
          <QualityKPICard
            title="Days In Trade"
            subtitle="With at least 1 physical call logged"
            value={metrics.daysInTrade}
            target={metrics.ditTarget}
            icon={CalendarDays}
            status={getRAGStatus(metrics.daysInTrade, "daysInTrade")}
          />
        </div>
      )}

      <div className="mb-6">
        <OutletDescription 
          outletName={selectedOutlet}
          cluster={clusterType}
          clusterDetails={clusterDetails}
          personaDetails={effectivePersonaDetails}
          salesData={salesData}
          isLoading={isPersonaLoading && !manualPersonaDetails}
          salesDataLoading={isSalesLoading}
        />
      </div>

      {selectedOutlet && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
          <div className="md:col-span-3 lg:col-span-5">
            <PerformanceChart data={salesData} isLoading={isSalesLoading} />
          </div>
        </div>
      )}

      <ConversationStartersGrid 
        selectedOutlet={selectedOutlet}
        onConversationStart={handleConversationStart}
      />

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
        selectedPersona={effectivePersonaDetails?.name || null}
        initialMessage={assistantPrompt}
      />
    </DashboardShell>
  );
}
