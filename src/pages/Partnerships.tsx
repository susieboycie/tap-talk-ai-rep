
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { DirectTradeChart } from "@/components/partnerships/direct-trade-chart";
import { DirectTradeTable } from "@/components/partnerships/direct-trade-table";
import { DirectTradeInsights } from "@/components/partnerships/direct-trade-insights";
import { useOutlet } from "@/contexts/outlet-context";
import { useTradeTermsData } from "@/hooks/use-trade-terms-data";

export default function Partnerships() {
  const { selectedOutlet } = useOutlet();
  const { data: tradeTermsData, isLoading } = useTradeTermsData(selectedOutlet);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Partnerships</h1>
          <p className="text-gray-400">Manage trade partnerships and relationships</p>
        </div>
        <div className="w-[240px]">
          <OutletSelector />
        </div>
      </div>

      {selectedOutlet && (
        <div className="space-y-6">
          {tradeTermsData && tradeTermsData.length > 0 && (
            <>
              <DirectTradeInsights directTradeData={tradeTermsData} />
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Product Performance Analysis</h2>
                <DirectTradeChart data={tradeTermsData} />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Performance Details</h2>
                <DirectTradeTable data={tradeTermsData} />
              </div>
            </>
          )}
          
          {isLoading && (
            <div className="text-gray-400">Loading trade terms data...</div>
          )}
          
          {!isLoading && (!tradeTermsData || tradeTermsData.length === 0) && (
            <div className="text-gray-400">No trade terms data available for this outlet.</div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
