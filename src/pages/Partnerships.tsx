
import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { ContractSummaryCard } from "@/components/partnerships/contract-summary-card";
import { TradeTermsVolumeChart } from "@/components/partnerships/trade-terms-volume-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOutlet } from "@/contexts/outlet-context";
import { useContractData } from "@/hooks/use-contract-data";
import { useTradeTermsVolume } from "@/hooks/use-trade-terms-volume";

export default function Partnerships() {
  const { selectedOutlet } = useOutlet();
  const { data: contractData, isLoading: contractLoading } = useContractData(selectedOutlet);
  const { data: volumeData, isLoading: volumeLoading } = useTradeTermsVolume(selectedOutlet);
  const [activeTab, setActiveTab] = useState("contracts");

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-repgpt-700 border-repgpt-600">
            <TabsTrigger value="contracts" className="data-[state=active]:bg-repgpt-500">
              Contracts
            </TabsTrigger>
            <TabsTrigger value="volumes" className="data-[state=active]:bg-repgpt-500">
              Volume Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-6 mt-4">
            {contractLoading && <div className="text-gray-400">Loading contract data...</div>}
            
            {!contractLoading && (!contractData || contractData.length === 0) && (
              <div className="text-gray-400">No contract data available for this outlet.</div>
            )}
            
            {contractData && contractData.length > 0 && (
              <ContractSummaryCard data={contractData} />
            )}
          </TabsContent>

          <TabsContent value="volumes" className="space-y-6 mt-4">
            {volumeLoading && <div className="text-gray-400">Loading volume data...</div>}
            
            {!volumeLoading && (!volumeData || volumeData.length === 0) && (
              <div className="text-gray-400">No volume data available for this outlet.</div>
            )}
            
            {volumeData && volumeData.length > 0 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Product Volume Analysis</h2>
                  <TradeTermsVolumeChart data={volumeData} />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {!selectedOutlet && (
        <div className="text-center py-8">
          <p className="text-gray-400">Please select an outlet to view partnership data.</p>
        </div>
      )}
    </DashboardShell>
  );
}
