
import { PersonaDetails, ClusterDetails } from "@/hooks/use-persona-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { SalesInsights } from "./sales-insights";

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

  // Generate natural language description
  const description = `${outletName} is a ${clusterDetails.venue_description?.toLowerCase() || cluster?.toLowerCase()} 
    operating as a ${personaDetails.name}. This venue typically focuses on ${clusterDetails.product_focus?.toLowerCase() || 'various products'} 
    and serves customers during ${clusterDetails.key_occasions?.toLowerCase() || 'various occasions'}. 
    ${clusterDetails.consumption_behavior ? `The typical consumption pattern shows ${clusterDetails.consumption_behavior.toLowerCase()}.` : ''} 
    ${totalGuinnessSales > 0 ? `The outlet has recorded ${totalGuinnessSales.toFixed(2)} units in Guinness sales.` : ''}
    As a ${personaDetails.name}, their key goals include ${personaDetails.goals?.toLowerCase()}, 
    while facing challenges such as ${personaDetails.pain_points?.toLowerCase()}.`;

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
          
          <div className="border-t border-repgpt-700 pt-4 mt-4">
            <SalesInsights data={salesData} isLoading={salesDataLoading} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
