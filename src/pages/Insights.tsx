
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SalesInsights } from "@/components/dashboard/sales-insights";
import { TraxInsights } from "@/components/dashboard/trax-insights";
import { BeerSalesInsights } from "@/components/dashboard/beer-sales-insights";
import { useOutletSalesData } from "@/hooks/use-outlet-sales-data";
import { useOutletTrax } from "@/hooks/use-outlet-trax";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { useOutlet } from "@/contexts/outlet-context";
import { ExportCardButtons } from "@/components/dashboard/export-card-buttons";
import { Card } from "@/components/ui/card";

export default function Insights() {
  const { selectedOutlet } = useOutlet();
  const { data: salesData, isLoading: isSalesLoading } = useOutletSalesData(selectedOutlet);
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
      <Card className="mb-6 relative">
        <div id="trax-insights-card" className="w-full">
          <TraxInsights data={traxData} isLoading={isTraxLoading} outletName={selectedOutlet} />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <ExportCardButtons cardId="trax-insights-card" title="TRAX Insights" />
        </div>
      </Card>

      {/* New row - Beer Sales Insights */}
      <Card className="mb-6 relative">
        <div id="beer-sales-card" className="w-full">
          <BeerSalesInsights outletName={selectedOutlet} />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <ExportCardButtons cardId="beer-sales-card" title="Beer Sales" />
        </div>
      </Card>

      {/* Second row - Sales Insights */}
      <Card className="mb-6 relative md:col-span-2">
        <div id="sales-insights-card" className="w-full">
          <SalesInsights data={salesData} isLoading={isSalesLoading} />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <ExportCardButtons cardId="sales-insights-card" title="Sales Insights" />
        </div>
      </Card>

      {/* Third row - Performance Chart */}
      <Card className="mb-6 relative">
        <div id="performance-chart-card" className="w-full">
          <PerformanceChart data={salesData} isLoading={isSalesLoading} />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <ExportCardButtons cardId="performance-chart-card" title="Performance Chart" />
        </div>
      </Card>
    </DashboardShell>
  );
}
