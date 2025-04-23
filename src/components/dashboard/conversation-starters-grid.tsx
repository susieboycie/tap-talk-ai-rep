
import { ConversationStarter } from "@/components/repgpt/conversation-starter";
import { MessageSquare } from "lucide-react";
import { Insights, Partnership, Quality } from "@/components/icons";

interface ConversationStartersGridProps {
  selectedOutlet: string;
  onConversationStart: (prompt: string) => void;
}

export function ConversationStartersGrid({ selectedOutlet, onConversationStart }: ConversationStartersGridProps) {
  return (
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
        onClick={onConversationStart}
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
        onClick={onConversationStart}
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
        onClick={onConversationStart}
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
        onClick={onConversationStart}
      />
    </div>
  );
}
