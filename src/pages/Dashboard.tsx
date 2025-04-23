
import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { KPICard } from "@/components/dashboard/kpi-card";
import { CustomerTable } from "@/components/dashboard/customer-table";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConversationStarter } from "@/components/repgpt/conversation-starter";
import { MessageSquare, BarChart, Users, Calendar, MessageCircle, Search } from "lucide-react";
import { Insights, Partnership, Quality } from "@/components/icons";
import { useAuth } from "@/contexts/auth-context";

// Mock personas data
const personas = [
  { id: "entrepreneur", name: "The Entrepreneur" },
  { id: "loyalist", name: "The Loyalist" },
  { id: "traditionalist", name: "The Traditionalist" },
  { id: "innovator", name: "The Innovator" },
  { id: "value-seeker", name: "The Value-Seeker" }
];

// Sample outlets for demo
const mockOutlets = [
  "The Fox", 
  "The Hound", 
  "The Crown", 
  "The King's Arms", 
  "The Queen's Head",
  "The Black Horse",
  "The White Lion",
  "The Red Lion",
  "The Green Dragon"
];

export default function Dashboard() {
  const { user } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  
  // Filtered outlets based on search
  const filteredOutlets = searchValue 
    ? mockOutlets.filter(outlet => outlet.toLowerCase().includes(searchValue.toLowerCase()))
    : [];

  const handleOutletSelect = (outlet: string) => {
    setSelectedOutlet(outlet);
    setSearchValue(outlet);
  };

  const handleConversationStart = (prompt: string) => {
    setAssistantPrompt(prompt);
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

      {/* Outlet Search + Persona Selection */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="relative">
            <Input
              placeholder="Enter Outlet Name (e.g. 'The Fox')"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full border-repgpt-600 bg-repgpt-700 text-white"
            />
            {filteredOutlets.length > 0 && searchValue && (
              <div className="absolute z-10 w-full mt-1 bg-repgpt-700 border border-repgpt-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredOutlets.map((outlet) => (
                  <div 
                    key={outlet} 
                    className="px-4 py-2 cursor-pointer hover:bg-repgpt-600 text-white"
                    onClick={() => handleOutletSelect(outlet)}
                  >
                    {outlet}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <Select onValueChange={setSelectedPersona}>
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

      {/* Conversation Starter Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <ConversationStarter
          icon={<MessageCircle className="h-5 w-5 text-purple-400" />}
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

      {/* Performance metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Monthly Volume"
          value="1,245 kegs"
          description="Total volume for April"
          trend="up"
          trendValue="+12.5% from last month"
          icon={<BarChart className="h-4 w-4 text-gray-400" />}
        />
        <KPICard
          title="Active Accounts"
          value="48"
          description="Accounts with orders this month"
          trend="neutral"
          trendValue="Same as last month"
          icon={<Users className="h-4 w-4 text-gray-400" />}
        />
        <KPICard
          title="Average Margin"
          value="62%"
          description="Across all products"
          trend="up"
          trendValue="+3.2% from last month"
          icon={<BarChart className="h-4 w-4 text-gray-400" />}
        />
        <KPICard
          title="Upcoming Meetings"
          value="8"
          description="Scheduled for next 7 days"
          trend="down"
          trendValue="-2 from last week"
          icon={<Calendar className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {/* Recent account activity */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
        <div className="md:col-span-2 lg:col-span-3">
          <PerformanceChart />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <UpcomingTasks />
        </div>
      </div>

      {/* Customer list */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <CustomerTable />
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
        selectedPersona={selectedPersona || null}
        initialMessage={assistantPrompt}
      />
    </DashboardShell>
  );
}
