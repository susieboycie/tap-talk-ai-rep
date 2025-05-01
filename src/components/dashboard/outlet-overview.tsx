
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClusterDetails, PersonaDetails } from "@/hooks/use-persona-details";
import { Store, Camera } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useOutletData } from "@/hooks/use-outlet-data";
import { useOutletTrax } from "@/hooks/use-outlet-trax";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

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
  const { data: outletData } = useOutletData(outletName);
  const { data: traxData, isLoading: isTraxLoading } = useOutletTrax(outletName);

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

  // Prepare Trax data for visualization
  const renderTraxInsights = () => {
    if (isTraxLoading) {
      return (
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-3/4 bg-repgpt-700 rounded"></div>
          <div className="h-4 w-1/2 bg-repgpt-700 rounded"></div>
        </div>
      );
    }

    if (!traxData) {
      return (
        <p className="text-sm text-gray-400">No TRAX insights available for this outlet</p>
      );
    }

    // Extract beer type distribution data for a simple visualization
    const beerTypeData = [
      { name: "Lager", value: traxData["Share of Lager_Lager_%"] || 0, color: "#FFD700" },
      { name: "Stout", value: traxData["Share of Lager_Stout_%"] || 0, color: "#1A1A1A" },
      { name: "Ale", value: traxData["Share of Lager_Ale_%"] || 0, color: "#8B4513" },
      { name: "Cider", value: traxData["Share of Lager_Cider_%"] || 0, color: "#32CD32" },
    ].filter(item => item.value > 0);

    const totalFacings = traxData["Total Facings"] || 0;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Tap Insights</h3>
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-300">{totalFacings} total facings</span>
          </div>
        </div>

        {beerTypeData.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[120px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={beerTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={45}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {beerTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex flex-col justify-center">
              <ul className="space-y-1">
                {beerTypeData.map((item, index) => (
                  <li key={`legend-${index}`} className="flex items-center gap-1 text-xs">
                    <div 
                      className="h-2 w-2 rounded-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-300">{item.name}: {item.value.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No beer type distribution data available</p>
        )}

        <div className="text-xs text-gray-400 mt-2">
          <p>Visit the Insights page for complete tap insights</p>
        </div>
      </div>
    );
  };

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
            <h3 className="text-sm font-medium text-white">TRAX Insights</h3>
            {renderTraxInsights()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
