
import { ConversationStarter } from "@/components/repgpt/conversation-starter";
import { MessageSquare } from "lucide-react";
import { Insights, Partnership, Quality } from "@/components/icons";
import { useLocation } from "react-router-dom";

interface ConversationStartersGridProps {
  selectedOutlet: string;
  onConversationStart: (prompt: string) => void;
}

export function ConversationStartersGrid({ selectedOutlet, onConversationStart }: ConversationStartersGridProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Truncate outlet name if it's too long
  const outletDisplay = selectedOutlet && selectedOutlet.length > 15 
    ? selectedOutlet.substring(0, 15) + "..." 
    : selectedOutlet || "outlet";

  // Only show relevant cards based on current page
  const isActivationsPage = currentPath === "/activations";
  const isInsightsPage = currentPath === "/insights";
  const isPartnershipsPage = currentPath === "/partnerships";
  const isQualityPage = currentPath === "/quality";

  return (
    <div className={`grid gap-4 ${isActivationsPage ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'} mb-6`}>
      {(!isInsightsPage && !isPartnershipsPage && !isQualityPage) && (
        <ConversationStarter
          icon={<MessageSquare className="h-5 w-5 text-purple-400" />}
          title="Activations"
          description="Help you sell and activate"
          examples={[
            `Key EPL points for ${outletDisplay}`,
            `Pitch for ${outletDisplay}`
          ]}
          color="border-purple-500"
          onClick={onConversationStart}
        />
      )}
      
      {(!isActivationsPage && !isPartnershipsPage && !isQualityPage) && (
        <ConversationStarter
          icon={<Insights className="h-5 w-5 text-blue-400" />}
          title="Insights"
          description="Insights tailored to your client"
          examples={[
            "Smirnoff vs Absolut",
            `Non-Diageo draught in ${outletDisplay}`
          ]}
          color="border-blue-500"
          onClick={onConversationStart}
        />
      )}
      
      {(!isActivationsPage && !isInsightsPage && !isQualityPage) && (
        <ConversationStarter
          icon={<Partnership className="h-5 w-5 text-green-400" />}
          title="Partnership"
          description="Manage contracts & volumes"
          examples={[
            `Guinness volume for ${outletDisplay}`,
            `${outletDisplay} orders`
          ]}
          color="border-green-500"
          onClick={onConversationStart}
        />
      )}
      
      {(!isActivationsPage && !isInsightsPage && !isPartnershipsPage) && (
        <ConversationStarter
          icon={<Quality className="h-5 w-5 text-amber-400" />}
          title="Quality"
          description="Ensure highest quality"
          examples=[
            "Guinness 0.0 requirements",
            `Diageo taps at ${outletDisplay}`
          ]
          color="border-amber-500"
          onClick={onConversationStart}
        />
      )}
    </div>
  );
}
