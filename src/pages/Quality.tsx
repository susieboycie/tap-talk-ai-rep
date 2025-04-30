
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { QualityKPICard } from "@/components/quality/quality-kpi-card";
import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { PhoneCall, CalendarDays, ShieldCheck, Beer, Wine, Martini, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRep } from "@/contexts/rep-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Quality() {
  const { selectedRep } = useRep();
  const { metrics, getRAGStatus, getProductRAGStatus, isLoading, error } = useQualityMetrics(selectedRep);

  const getCallComplianceStatus = () => {
    if (metrics.callCompliance >= 80) return "strong";
    if (metrics.callCompliance >= 60) return "needs attention";
    return "at risk";
  };

  const getDistributionStatus = (actual: number, target: number) => {
    if (target === 0) return "no target set";
    const percentage = (actual / target) * 100;
    if (percentage >= 90) return "performing well";
    if (percentage >= 70) return "needs improvement";
    return "significantly below target";
  };

  const renderLoadingState = () => (
    <div className="space-y-6">
      <Card className="p-6 border-orange-600 bg-orange-900/30">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/2 bg-orange-800/50" />
              <Skeleton className="h-8 w-24 bg-orange-800/50" />
              <Skeleton className="h-4 w-3/4 bg-orange-800/50" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-orange-600 bg-orange-900/30">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/2 bg-orange-800/50" />
              <Skeleton className="h-8 w-24 bg-orange-800/50" />
              <Skeleton className="h-4 w-3/4 bg-orange-800/50" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderErrorState = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load quality metrics data. Please try again later.
      </AlertDescription>
    </Alert>
  );

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Quality</h1>
          <p className="text-gray-400">Your performance metrics for the last 8 weeks rolling</p>
        </div>
      </div>

      {isLoading && renderLoadingState()}

      {error && renderErrorState()}

      {!isLoading && !error && (
        <>
          <Card className="p-6 mb-6 border-orange-600 bg-orange-900/30">
            <h2 className="text-xl font-semibold text-white mb-4">Your Performance Summary</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                Your call compliance is currently {metrics.callCompliance.toFixed(1)}%, which is {getCallComplianceStatus()}. 
                You are averaging {metrics.callsPerDay.toFixed(1)} calls per day against your target of {metrics.cpdTarget.toFixed(1)}, 
                with {metrics.daysInTrade.toFixed(1)} days in trade versus your target of {metrics.ditTarget.toFixed(1)} days.
              </p>
              <p>
                Your product distribution shows: 
                Your Guinness is {getDistributionStatus(metrics.guinness.actual, metrics.guinness.target)} at {metrics.guinness.target > 0 ? (Math.round((metrics.guinness.actual / metrics.guinness.target) * 1000) / 10).toFixed(1) : 0.0}% of target, 
                Your Rockshore distribution is {getDistributionStatus(metrics.rockshoreDistribution.actual, metrics.rockshoreDistribution.target)} at {metrics.rockshoreDistribution.target > 0 ? (Math.round((metrics.rockshoreDistribution.actual / metrics.rockshoreDistribution.target) * 1000) / 10).toFixed(1) : 0.0}% of target, 
                and your Smirnoff Ice is {getDistributionStatus(metrics.smirnoffIce.actual, metrics.smirnoffIce.target)} at {metrics.smirnoffIce.target > 0 ? (Math.round((metrics.smirnoffIce.actual / metrics.smirnoffIce.target) * 1000) / 10).toFixed(1) : 0.0}% of target.
              </p>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 border-orange-600 bg-orange-900/30">
              <div className="grid gap-4 md:grid-cols-3">
                <QualityKPICard
                  title="Your Call Compliance"
                  subtitle="In last 8 weeks rolling"
                  value={`${metrics.callCompliance.toFixed(1)}%`}
                  icon={ShieldCheck}
                  status={getRAGStatus(metrics.callCompliance, "callCompliance")}
                />
                <QualityKPICard
                  title="Your Calls per Day"
                  subtitle="Physical calls in last 8 weeks rolling"
                  value={metrics.callsPerDay.toFixed(1)}
                  target={metrics.cpdTarget}
                  icon={PhoneCall}
                  status={getRAGStatus(metrics.callsPerDay, "callsPerDay")}
                />
                <QualityKPICard
                  title="Your Days In Trade"
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
                  title="Your Guinness 0.0"
                  subtitle="Current Installs vs Target"
                  value={metrics.guinness.actual}
                  target={metrics.guinness.target}
                  icon={Beer}
                  status={getProductRAGStatus(metrics.guinness.actual, metrics.guinness.target)}
                />
                <QualityKPICard
                  title="Your Rockshore Distribution"
                  subtitle="Wave Report Distribution"
                  value={metrics.rockshoreDistribution.actual}
                  target={metrics.rockshoreDistribution.target}
                  icon={Beer}
                  status={getProductRAGStatus(metrics.rockshoreDistribution.actual, metrics.rockshoreDistribution.target)}
                />
                <QualityKPICard
                  title="Your Rockshore Activations"
                  subtitle="Wave Report Activations"
                  value={metrics.rockshoreActivations}
                  icon={Beer}
                  status="amber"
                />
                <QualityKPICard
                  title="Your Smirnoff Ice"
                  subtitle="Successful Sell In"
                  value={metrics.smirnoffIce.actual}
                  target={metrics.smirnoffIce.target}
                  icon={Martini}
                  status={getProductRAGStatus(metrics.smirnoffIce.actual, metrics.smirnoffIce.target)}
                />
                <QualityKPICard
                  title="Your Casamigos"
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
