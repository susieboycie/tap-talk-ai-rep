
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClusterDetails, PersonaDetails } from "@/hooks/use-persona-details";
import { Store } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { useOutletData } from "@/hooks/use-outlet-data";

interface OutletOverviewProps {
  outletName: string | null;
  cluster: string | null;
  clusterDetails?: ClusterDetails | null;
  personaDetails: PersonaDetails | null;
  salesData: Tables<"daily_sales_volume">[] | null;
  isLoading: boolean;
  salesDataLoading?: boolean;
}

export function OutletOverview({ 
  outletName, 
  cluster, 
  clusterDetails, 
  personaDetails, 
  salesData,
  isLoading,
  salesDataLoading = false
}: OutletOverviewProps) {
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

  if (!outletName || !personaDetails) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Outlet Overview</CardTitle>
          <Store className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            Select an outlet to see its overview
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="overflow-hidden">
          <CardTitle className="text-lg font-medium text-white truncate">{outletName}</CardTitle>
          <p className="text-sm text-gray-400 mt-1 truncate">
            {cluster} {outletData?.["City"] && `| ${outletData["City"]}`} 
            {outletData?.["Global Outlet Segment"] && `| ${outletData["Global Outlet Segment"]}`}
          </p>
        </div>
        <Store className="h-5 w-5 text-gray-400 flex-shrink-0" />
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Outlet Profile</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {clusterDetails?.venue_description && (
                <li className="break-words">{clusterDetails.venue_description}</li>
              )}
              {clusterDetails?.consumption_behavior && (
                <li className="break-words"><span className="font-medium">Consumption:</span> {clusterDetails.consumption_behavior}</li>
              )}
              {clusterDetails?.key_occasions && (
                <li className="break-words"><span className="font-medium">Key Occasions:</span> {clusterDetails.key_occasions}</li>
              )}
              {clusterDetails?.product_focus && (
                <li className="break-words"><span className="font-medium">Product Focus:</span> {clusterDetails.product_focus}</li>
              )}
              {outletData?.["Global Outlet Channel"] && (
                <li className="break-words"><span className="font-medium">Channel:</span> {outletData["Global Outlet Channel"]}</li>
              )}
              {outletData?.["Global Outlet Segment"] && (
                <li className="break-words"><span className="font-medium">Segment:</span> {outletData["Global Outlet Segment"]}</li>
              )}
              {clusterDetails?.price_tier && (
                <li className="break-words"><span className="font-medium">Price Tier:</span> {clusterDetails.price_tier}</li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Persona Insights</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="break-words"><span className="font-medium">Persona Type:</span> {personaDetails.name}</li>
              <li className="break-words"><span className="font-medium">Key Goals:</span> {personaDetails.goals}</li>
              <li className="break-words"><span className="font-medium">Pain Points:</span> {personaDetails.pain_points}</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Quality Overview</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="break-words"><span className="font-medium">Call Compliance:</span> {metrics.callCompliance}% ({getRAGStatus(metrics.callCompliance, "callCompliance") === "green" ? "Good" : getRAGStatus(metrics.callCompliance, "callCompliance") === "amber" ? "Needs Attention" : "At Risk"})</li>
              <li className="break-words"><span className="font-medium">Calls per Day:</span> {metrics.callsPerDay.toFixed(1)} vs target {metrics.cpdTarget}</li>
              <li className="break-words"><span className="font-medium">Days in Trade:</span> {metrics.daysInTrade} days vs target {metrics.ditTarget}</li>
              <li className="break-words space-y-1"><span className="font-medium">Product Distribution:</span> 
                <ul className="pl-4">
                  <li className="flex flex-wrap justify-between">
                    <span>Guinness:</span> 
                    <span>{metrics.guinness.target > 0 ? Math.round((metrics.guinness.actual / metrics.guinness.target) * 100) : 0}% of target</span>
                  </li>
                  <li className="flex flex-wrap justify-between">
                    <span>Rockshore:</span> 
                    <span>{metrics.rockshoreDistribution.target > 0 ? Math.round((metrics.rockshoreDistribution.actual / metrics.rockshoreDistribution.target) * 100) : 0}% of target</span>
                  </li>
                  <li className="flex flex-wrap justify-between">
                    <span>Smirnoff Ice:</span> 
                    <span>{metrics.smirnoffIce.target > 0 ? Math.round((metrics.smirnoffIce.actual / metrics.smirnoffIce.target) * 100) : 0}% of target</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
