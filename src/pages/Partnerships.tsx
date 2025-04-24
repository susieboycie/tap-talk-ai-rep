import { DashboardShell } from "@/components/ui/dashboard-shell";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { DirectTradeChart } from "@/components/partnerships/direct-trade-chart";
import { DirectTradeTable } from "@/components/partnerships/direct-trade-table";
import { DirectTradeInsights } from "@/components/partnerships/direct-trade-insights";
import { useDirectTrade } from "@/hooks/use-direct-trade";
import { useOutlet } from "@/contexts/outlet-context";

export default function Partnerships() {
  const { selectedOutlet } = useOutlet();
  const { data: directTradeData, isLoading: isLoadingDirectTrade } = useDirectTrade(selectedOutlet);

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
          {directTradeData && directTradeData.length > 0 && (
            <>
              <DirectTradeInsights directTradeData={directTradeData} />
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Direct Trade Analysis</h2>
                <DirectTradeChart data={directTradeData} />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Direct Trade Details</h2>
                <DirectTradeTable data={directTradeData} />
              </div>
            </>
          )}
          
          {isLoadingDirectTrade && (
            <div className="text-gray-400">Loading direct trade data...</div>
          )}
          
          {!isLoadingDirectTrade && (!directTradeData || directTradeData.length === 0) && (
            <div className="text-gray-400">No direct trade data available for this outlet.</div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
