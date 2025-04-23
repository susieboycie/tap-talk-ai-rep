
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClusterDetails, PersonaDetails } from "@/hooks/use-persona-details";
import { Store } from "lucide-react";

interface OutletOverviewProps {
  outletName: string | null;
  cluster: string | null;
  clusterDetails?: ClusterDetails | null;
  personaDetails: PersonaDetails | null;
  isLoading: boolean;
}

export function OutletOverview({ outletName, cluster, clusterDetails, personaDetails, isLoading }: OutletOverviewProps) {
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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-white">{outletName}</CardTitle>
            <p className="text-sm text-gray-400 mt-1">{cluster}</p>
          </div>
          <Store className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Cluster Information */}
          {clusterDetails && (
            <>
              {clusterDetails.consumption_behavior && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Consumption Behavior</p>
                  <p className="text-sm text-gray-300">{clusterDetails.consumption_behavior}</p>
                </div>
              )}
              {clusterDetails.key_occasions && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Key Occasions</p>
                  <p className="text-sm text-gray-300">{clusterDetails.key_occasions}</p>
                </div>
              )}
              {clusterDetails.venue_description && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Venue Description</p>
                  <p className="text-sm text-gray-300">{clusterDetails.venue_description}</p>
                </div>
              )}
              {clusterDetails.product_focus && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Product Focus</p>
                  <p className="text-sm text-gray-300">{clusterDetails.product_focus}</p>
                </div>
              )}
              {clusterDetails.location_type && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Location Type</p>
                  <p className="text-sm text-gray-300">{clusterDetails.location_type}</p>
                </div>
              )}
              {clusterDetails.price_tier && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Price Tier</p>
                  <p className="text-sm text-gray-300">{clusterDetails.price_tier}</p>
                </div>
              )}
              {clusterDetails.nsv_percent && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">NSV %</p>
                  <p className="text-sm text-gray-300">{clusterDetails.nsv_percent}</p>
                </div>
              )}
              {clusterDetails.universe_percent && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Universe %</p>
                  <p className="text-sm text-gray-300">{clusterDetails.universe_percent}</p>
                </div>
              )}
            </>
          )}
          
          {/* Persona Information */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Persona Type</p>
            <p className="text-sm font-medium text-white">{personaDetails.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Key Goals</p>
            <p className="text-sm text-gray-300">{personaDetails.goals}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Pain Points</p>
            <p className="text-sm text-gray-300">{personaDetails.pain_points}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
