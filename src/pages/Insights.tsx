
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SalesInsights } from "@/components/dashboard/sales-insights";
import { TraxInsights } from "@/components/dashboard/trax-insights";
import { BeerSalesInsights } from "@/components/dashboard/beer-sales-insights";
import { useOutletSales } from "@/hooks/use-outlet-sales";
import { useOutletTrax } from "@/hooks/use-outlet-trax";
import { useSalesVolumeData } from "@/hooks/use-sales-volume-data"; 
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { useOutlet } from "@/contexts/outlet-context";
import { ActivationStatusInsights } from "@/components/dashboard/activation-status-insights";

export default function Insights() {
  const { selectedOutlet } = useOutlet();
  const { data: salesData, isLoading: isSalesLoading } = useOutletSales(selectedOutlet);
  const { data: traxData, isLoading: isTraxLoading } = useOutletTrax(selectedOutlet);
  
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Insights</h1>
          <p className="text-gray-400">View sales performance and insights</p>
        </div>
        <div className="w-[240px]">
          <OutletSelector />
        </div>
      </div>

      {/* First row - TRAX Insights */}
      <div className="grid gap-4 mb-6">
        <div>
          <TraxInsights data={traxData} isLoading={isTraxLoading} outletName={selectedOutlet} />
        </div>
      </div>

      {/* New row - Beer Sales Insights */}
      <div className="grid gap-4 mb-6">
        <div>
          <BeerSalesInsights outletName={selectedOutlet} />
        </div>
      </div>

      {/* New row - Activation Status Insights */}
      <div className="grid gap-4 mb-6">
        <div>
          <ActivationStatusInsights outletName={selectedOutlet} />
        </div>
      </div>

      {/* Second row - Sales Insights */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="md:col-span-2">
          <SalesInsights data={salesData} isLoading={isSalesLoading} />
        </div>
      </div>

      {/* Third row - Performance Chart */}
      <div className="grid gap-4 mb-6">
        <div>
          <PerformanceChart data={salesData} isLoading={isSalesLoading} />
        </div>
      </div>
    </DashboardShell>
  );
}
