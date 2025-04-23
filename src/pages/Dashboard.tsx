
import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { KPICard } from "@/components/dashboard/kpi-card";
import { CustomerTable } from "@/components/dashboard/customer-table";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { MessageSquare, BarChart, Users, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function Dashboard() {
  const { user } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {user?.name}. Here's your sales overview.
          </p>
        </div>
        <Button 
          className="bg-repgpt-400 hover:bg-repgpt-500 text-white"
          onClick={() => setIsAssistantOpen(true)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask RepGPT
        </Button>
      </div>

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

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
        <PerformanceChart />
        <UpcomingTasks />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <CustomerTable />
      </div>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </DashboardShell>
  );
}
