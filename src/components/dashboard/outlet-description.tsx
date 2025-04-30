
import { PersonaDetails, ClusterDetails } from "@/hooks/use-persona-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { SalesInsights } from "./sales-insights";
import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { QualityKPICard } from "../quality/quality-kpi-card";
import { PhoneCall, CalendarDays, ShieldCheck } from "lucide-react";
import { useOutletData } from "@/hooks/use-outlet-data";

interface OutletDescriptionProps {
  outletName: string | null;
  cluster: string | null;
  clusterDetails?: ClusterDetails | null;
  personaDetails: PersonaDetails | null;
  salesData: Tables<"daily_sales_volume">[] | null;
  isLoading: boolean;
  salesDataLoading?: boolean;
}

export function OutletDescription({ 
  outletName, 
  cluster, 
  clusterDetails, 
  personaDetails, 
  salesData,
  isLoading,
  salesDataLoading = false
}: OutletDescriptionProps) {
  const { metrics, getRAGStatus } = useQualityMetrics(outletName || "");
  const { data: outletData } = useOutletData(outletName);

  if (isLoading) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Loading outlet overview...</CardTitle>
          <Store className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-repgpt-700 rounded"></div>
            <div className="h-4 w-1/2 bg-repgpt-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!outletName || !personaDetails || !clusterDetails) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Outlet Overview</CardTitle>
          <Store className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            Select an outlet to see its description
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total Guinness sales if available
  const totalGuinnessSales = salesData?.reduce((total, record) => 
    total + (record.Guinness_Draught_In_Keg_MTD_Billed || 0), 0) || 0;

  // Enhanced natural language description with quality metrics and outlet data
  const description = `${outletName} is a ${clusterDetails.venue_description?.toLowerCase() || cluster?.toLowerCase() || 'venue'} 
    ${outletData?.["City"] ? `in ${outletData["City"]}` : ''} 
    operating as a ${personaDetails.name}. 
    ${outletData?.["Global Outlet Segment"] ? `This ${outletData["Global Outlet Segment"].toLowerCase()} venue` : 'This venue'} typically focuses on ${clusterDetails.product_focus?.toLowerCase() || 'various products'} 
    and serves customers during ${clusterDetails.key_occasions?.toLowerCase() || 'various occasions'}. 
    ${clusterDetails.consumption_behavior ? `The typical consumption pattern shows ${clusterDetails.consumption_behavior.toLowerCase()}.` : ''} 
    ${totalGuinnessSales > 0 ? `The outlet has recorded ${totalGuinnessSales.toFixed(1)} units in Guinness sales.` : ''}
    As a ${personaDetails.name}, their key goals include ${personaDetails.goals?.toLowerCase()}, 
    while facing challenges such as ${personaDetails.pain_points?.toLowerCase()}. 
    In terms of quality metrics, the outlet has ${metrics.callCompliance.toFixed(1)}% call compliance, 
    averaging ${metrics.callsPerDay.toFixed(1)} calls per day and ${metrics.daysInTrade.toFixed(1)} days in trade over the last 8 weeks.`;

  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white">Outlet Profile</CardTitle>
        <Store className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-300 leading-relaxed">
            {description}
          </p>
          
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
          
          <div className="border-t border-repgpt-700 pt-4 mt-4">
            <SalesInsights data={salesData} isLoading={salesDataLoading} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
