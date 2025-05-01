
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClusterDetails, PersonaDetails } from "@/hooks/use-persona-details";
import { Store, Camera } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useOutletData } from "@/hooks/use-outlet-data";
import { useOutletTrax } from "@/hooks/use-outlet-trax";
import { SalesInsights } from "@/components/dashboard/sales-insights";
import { useOutletSalesData } from "@/hooks/use-outlet-sales-data";

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
  
  // Add fallback data source for sales insights
  const { data: altSalesData, isLoading: isAltSalesDataLoading } = useOutletSalesData(outletName);
  
  // Use either primary sales data or alternative data
  const effectiveSalesData = (salesData && salesData.length > 0) ? salesData : altSalesData;
  const isEffectiveSalesDataLoading = salesDataLoading && isAltSalesDataLoading;

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

  // Generate text description for TRAX insights
  const renderTraxTextInsights = () => {
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

    // Extract beer type distribution data
    const beerTypes = [
      { name: "Lager", value: traxData["Share of Lager_Lager_%"] || 0 },
      { name: "Stout", value: traxData["Share of Lager_Stout_%"] || 0 },
      { name: "Ale", value: traxData["Share of Lager_Ale_%"] || 0 },
      { name: "Cider", value: traxData["Share of Lager_Cider_%"] || 0 },
    ].filter(item => item.value > 0);

    // Extract presentation format data
    const tapsPercentage = traxData["Share of Packaged_Beer Taps_%"] || 0;
    const packagedPercentage = traxData["Share of Packaged_Packaged_%"] || 0;
    
    // Extract beverage category mix
    const beerCiderPercentage = traxData["Share of LAD vs. RTD. Vs. Spirits_LAD_%"] || 0;
    const spiritsPercentage = traxData["Share of LAD vs. RTD. Vs. Spirits_Sprits_%"] || 0;
    const rtdPercentage = traxData["Share of LAD vs. RTD. Vs. Spirits_RTD_%"] || 0;
    
    // Find dominant beer type
    const dominantBeerType = beerTypes.length > 0 
      ? beerTypes.sort((a, b) => b.value - a.value)[0] 
      : null;
    
    // Find dominant price tier
    const priceTiers = [
      { name: "Value", value: traxData["Price Tier Split_Value_%"] || 0 },
      { name: "Standard", value: traxData["Price Tier Split_Standard_%"] || 0 },
      { name: "Premium", value: traxData["Price Tier Split_Premium_%"] || 0 },
      { name: "Super Premium", value: traxData["Price Tier Split_Super Premium_%"] || 0 },
      { name: "Ultra Premium", value: traxData["Price Tier Split_Ultra Premium_%"] || 0 },
      { name: "Luxury", value: traxData["Price Tier Split_Luxury_%"] || 0 },
    ].filter(item => item.value > 0);
    
    const dominantPriceTier = priceTiers.length > 0 
      ? priceTiers.sort((a, b) => b.value - a.value)[0] 
      : null;
    
    // Generate descriptive text
    const totalFacings = traxData["Total Facings"] || 0;
    
    // Format for presentation style
    let presentationStyle = "";
    if (tapsPercentage > 70) {
      presentationStyle = "primarily served on tap";
    } else if (tapsPercentage > 50) {
      presentationStyle = "served more on tap than packaged";
    } else if (tapsPercentage < 30) {
      presentationStyle = "primarily served in packaged format";
    } else {
      presentationStyle = "served with a balanced mix of tap and packaged formats";
    }
    
    // Format for category mix
    let categoryMix = "";
    if (beerCiderPercentage > 70) {
      categoryMix = "predominantly beer and cider";
    } else if (spiritsPercentage > 40) {
      categoryMix = "with a strong spirits presence";
    } else if (rtdPercentage > 30) {
      categoryMix = "with significant RTD representation";
    } else {
      categoryMix = "with a diverse beverage category mix";
    }
    
    // Build the insights text
    let insightsText = `This outlet has ${totalFacings} total facings, ${presentationStyle}, ${categoryMix}.`;
    
    if (dominantBeerType) {
      insightsText += ` The beer selection is primarily ${dominantBeerType.name.toLowerCase()} (${Math.round(dominantBeerType.value)}%).`;
    }
    
    if (dominantPriceTier) {
      insightsText += ` Products are mostly in the ${dominantPriceTier.name.toLowerCase()} price tier (${Math.round(dominantPriceTier.value)}%).`;
    }
    
    // Add beer type breakdown if there's more than one type
    if (beerTypes.length > 1) {
      insightsText += " Beer type breakdown: ";
      insightsText += beerTypes.map(type => `${type.name} (${Math.round(type.value)}%)`).join(", ") + ".";
    }
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Tap Insights</h3>
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-300">{totalFacings} total facings</span>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          {insightsText}
        </p>
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
            {outletData?.["City"] && `${outletData["City"]}`} 
            {outletData?.["Global Outlet Segment"] && ` | ${outletData["Global Outlet Segment"]}`}
            {outletData?.["Local Outlet-Segment1"] && ` | ${outletData["Local Outlet-Segment1"]}`}
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
              {outletData?.["Local Outlet-Segment1"] && (
                <li className="break-words"><span className="font-medium">Local Segment:</span> {outletData["Local Outlet-Segment1"]}</li>
              )}
              {/* Add Outlet Visit Prioritisation information */}
              {outletData?.["Outlet Visit Prioritisation"] && (
                <li className="break-words"><span className="font-medium">Visit Priority:</span> {outletData["Outlet Visit Prioritisation"]}</li>
              )}
              {clusterDetails?.price_tier && (
                <li className="break-words"><span className="font-medium">Price Tier:</span> {clusterDetails.price_tier}</li>
              )}
            </ul>
          </div>

          {/* Add the 7-day Sales Trends section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">7-Day Sales Trends</h3>
            <div className="bg-blue-900/20 rounded-md border border-blue-800">
              <SalesInsights data={effectiveSalesData} isLoading={isEffectiveSalesDataLoading} />
            </div>
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
            {renderTraxTextInsights()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
