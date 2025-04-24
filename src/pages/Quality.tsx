import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { OutletSelector } from "@/components/dashboard/outlet-selector";
import { QualityKPICard } from "@/components/quality/quality-kpi-card";
import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { PhoneCall, CalendarDays, ShieldCheck, Beer, Wine, Martini } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Quality() {
  const [selectedOutlet, setSelectedOutlet] = useState<string>("");
  const { metrics, getRAGStatus, getProductRAGStatus } = useQualityMetrics(selectedOutlet);

  const getCallComplianceStatus = () => {
    if (metrics.callCompliance >= 80) return "strong";
    if (metrics.callCompliance >= 60) return "needs attention";
    return "at risk";
  };

  const getDistributionStatus = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 90) return "performing well";
    if (percentage >= 70) return "needs improvement";
    return "significantly below target";
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Quality</h1>
          <p className="text-gray-400">Monitor call quality metrics and compliance in last 8 weeks rolling</p>
        </div>
        <div className="w-[240px]">
          <OutletSelector 
            selectedOutlet={selectedOutlet} 
            onOutletChange={setSelectedOutlet} 
          />
        </div>
      </div>

      {selectedOutlet && (
        <>
          <Card className="p-6 mb-6 border-orange-600 bg-orange-900/30">
            <h2 className="text-xl font-semibold text-white mb-4">Quality Overview</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                Call compliance is currently {metrics.callCompliance}%, which is {getCallComplianceStatus()}. 
                The outlet is averaging {metrics.callsPerDay.toFixed(1)} calls per day against a target of {metrics.cpdTarget}, 
                with {metrics.daysInTrade} days in trade versus the target of {metrics.ditTarget} days.
              </p>
              <p>
                Product distribution shows: 
                Guinness is {getDistributionStatus(metrics.guinness.actual, metrics.guinness.target)} at {Math.round((metrics.guinness.actual / metrics.guinness.target) * 100)}% of target, 
                Rockshore distribution is {getDistributionStatus(metrics.rockshoreDistribution.actual, metrics.rockshoreDistribution.target)} at {Math.round((metrics.rockshoreDistribution.actual / metrics.rockshoreDistribution.target) * 100)}% of target, 
                and Smirnoff Ice is {getDistributionStatus(metrics.smirnoffIce.actual, metrics.smirnoffIce.target)} at {Math.round((metrics.smirnoffIce.actual / metrics.smirnoffIce.target) * 100)}% of target.
              </p>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 border-orange-600 bg-orange-900/30">
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

            <Card className="p-6 border-orange-600 bg-orange-900/30">
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
                  icon={Martini}
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
        </>
      )}
    </DashboardShell>
  );
}
