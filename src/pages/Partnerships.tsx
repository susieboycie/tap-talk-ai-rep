
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { SalesKPITable } from "@/components/partnerships/sales-kpi-table";
import { useState } from "react";

export default function Partnerships() {
  const [selectedOutlet, setSelectedOutlet] = useState("");

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Partnerships</h1>
          <p className="text-gray-400">Manage trade partnerships and relationships</p>
        </div>
      </div>

      <div className="mb-6">
        <OutletSelector 
          selectedOutlet={selectedOutlet}
          onOutletChange={setSelectedOutlet}
        />
      </div>

      {selectedOutlet && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Sales Performance</h2>
            <SalesKPITable selectedOutlet={selectedOutlet} />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
