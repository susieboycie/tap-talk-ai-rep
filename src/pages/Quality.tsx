
import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { QualityKPICard } from "@/components/quality/quality-kpi-card";
import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { PhoneCall, CalendarDays, ShieldCheck, Beer, Wine, Cocktail } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Quality() {
  const [selectedOutlet, setSelectedOutlet] = useState<string>("");
  const { metrics, getRAGStatus, getProductRAGStatus } = useQualityMetrics(selectedOutlet);

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
        <div className="space-y-6">
          <Card className="p-6 border-repgpt-700 bg-repgpt-800">
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
          </Card>

          <Card className="p-6 border-repgpt-700 bg-repgpt-800">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              <QualityKPICard
                title="Guinness 0.0"
                subtitle="Current Installs vs Target"
                value={metrics.guinness.actual}
                target={metrics.guinness.target}
                icon={Beer}
                status={getProductRAGStatus(metrics.guinness.actual, metrics.guinness.target)}
              />
              <QualityKPICard
                title="Rockshore Distribution"
                subtitle="Wave Report Distribution"
                value={metrics.rockshoreDistribution.actual}
                target={metrics.rockshoreDistribution.target}
                icon={Beer}
                status={getProductRAGStatus(metrics.rockshoreDistribution.actual, metrics.rockshoreDistribution.target)}
              />
              <QualityKPICard
                title="Rockshore Activations"
                subtitle="Wave Report Activations"
                value={metrics.rockshoreActivations}
                icon={Beer}
                status="amber"
              />
              <QualityKPICard
                title="Smirnoff Ice"
                subtitle="Successful Sell In"
                value={metrics.smirnoffIce.actual}
                target={metrics.smirnoffIce.target}
                icon={Cocktail}
                status={getProductRAGStatus(metrics.smirnoffIce.actual, metrics.smirnoffIce.target)}
              />
              <QualityKPICard
                title="Casamigos"
                subtitle="Successful Sell In"
                value={metrics.casamigos.actual}
                target={metrics.casamigos.target}
                icon={Wine}
                status={getProductRAGStatus(metrics.casamigos.actual, metrics.casamigos.target)}
              />
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
