import { ConversationStarter } from "@/components/repgpt/conversation-starter";
import { MessageSquare } from "lucide-react";
import { Insights, Partnership, Quality } from "@/components/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ConversationStartersGridProps {
  selectedOutlet: string;
  onConversationStart: (prompt: string) => void;
}

export function ConversationStartersGrid({ selectedOutlet, onConversationStart }: ConversationStartersGridProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isAskRepGPTPage = currentPath === "/ask-repgpt";
  const isHomePage = currentPath === "/";
  
  // Truncate outlet name if it's too long
  const outletDisplay = selectedOutlet && selectedOutlet.length > 15 
    ? selectedOutlet.substring(0, 15) + "..." 
    : selectedOutlet || "outlet";

  // Only show relevant cards based on current page
  const isActivationsPage = currentPath === "/activations";
  const isInsightsPage = currentPath === "/insights";
  const isPartnershipsPage = currentPath === "/partnerships";
  const isQualityPage = currentPath === "/quality";

  // If we're on the Activations page, don't show any prompts
  if (isActivationsPage) {
    return null;
  }

  // If we're on the home page, show navigation buttons instead of conversation starters
  if (isHomePage) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <div className="rounded-lg bg-repgpt-800 border border-purple-500 p-6 hover:bg-repgpt-700 transition-colors cursor-pointer" 
             onClick={() => navigate('/activations')}>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Activations</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">Help you sell and activate</p>
        </div>
        
        <div className="rounded-lg bg-repgpt-800 border border-blue-500 p-6 hover:bg-repgpt-700 transition-colors cursor-pointer"
             onClick={() => navigate('/insights')}>
          <div className="flex items-center gap-2 mb-2">
            <Insights className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Insights</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">Insights tailored to your client</p>
        </div>
        
        <div className="rounded-lg bg-repgpt-800 border border-green-500 p-6 hover:bg-repgpt-700 transition-colors cursor-pointer"
             onClick={() => navigate('/partnerships')}>
          <div className="flex items-center gap-2 mb-2">
            <Partnership className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Partnership</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">Manage contracts & volumes</p>
        </div>
        
        <div className="rounded-lg bg-repgpt-800 border border-amber-500 p-6 hover:bg-repgpt-700 transition-colors cursor-pointer"
             onClick={() => navigate('/quality')}>
          <div className="flex items-center gap-2 mb-2">
            <Quality className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Quality</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">Ensure highest quality</p>
        </div>
      </div>
    );
  }

  // For other pages (like AskRepGPT), keep the original conversation starters
  return (
    <div className={`grid gap-4 ${isAskRepGPTPage ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'} w-full`}>
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
          examples={[
            "Guinness 0.0 requirements",
            `Diageo taps at ${outletDisplay}`
          ]}
          color="border-amber-500"
          onClick={onConversationStart}
        />
      )}
    </div>
  );
}
