
import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { QualityKPICard } from "@/components/quality/quality-kpi-card";
import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { PhoneCall, CalendarDays, ShieldCheck } from "lucide-react";

export default function Quality() {
  const [selectedOutlet, setSelectedOutlet] = useState<string>("");
  const { metrics, getRAGStatus } = useQualityMetrics(selectedOutlet);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Quality</h1>
          <p className="text-gray-400">Monitor call quality metrics and compliance in last 8 weeks rolling</p>
        </div>
      </div>

      <div className="mb-6">
        <OutletSelector 
          selectedOutlet={selectedOutlet} 
          onOutletChange={setSelectedOutlet} 
        />
      </div>

      {selectedOutlet && (
        <div className="grid gap-4 md:grid-cols-3">
          <QualityKPICard
            title="Call Compliance"
            subtitle="In last 8 weeks rolling"
            value={`${metrics.callCompliance}%`}
            icon={ShieldCheck}
            status={getRAGStatus(metrics.callCompliance, "callCompliance")}
          />
          <QualityKPICard
            title="Calls per Day"
            subtitle="Physical calls in last 8 weeks rolling"
            value={metrics.callsPerDay.toFixed(1)}
            target={metrics.cpdTarget}
            icon={PhoneCall}
            status={getRAGStatus(metrics.callsPerDay, "callsPerDay")}
          />
          <QualityKPICard
            title="Days In Trade"
            subtitle="With at least 1 physical call logged"
            value={metrics.daysInTrade}
            target={metrics.ditTarget}
            icon={CalendarDays}
            status={getRAGStatus(metrics.daysInTrade, "daysInTrade")}
          />
        </div>
      )}
    </DashboardShell>
  );
}
