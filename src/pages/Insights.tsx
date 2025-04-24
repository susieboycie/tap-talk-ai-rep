
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SalesInsights } from "@/components/dashboard/sales-insights";
import { useOutletSales } from "@/hooks/use-outlet-sales";

export default function Insights() {
  const { data: salesData, isLoading: isSalesLoading } = useOutletSales("");
  
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Insights</h1>
          <p className="text-gray-400">View sales performance and insights</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
        <div className="md:col-span-2 lg:col-span-3">
          <SalesInsights data={salesData} isLoading={isSalesLoading} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
        <div className="md:col-span-3 lg:col-span-5">
          <PerformanceChart data={salesData} isLoading={isSalesLoading} />
        </div>
      </div>
    </DashboardShell>
  );
}
