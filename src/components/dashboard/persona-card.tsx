
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PersonaDetails, ClusterDetails } from "@/hooks/use-persona-details";
import { Users } from "lucide-react";

interface PersonaCardProps {
  outletName: string | null;
  cluster: string | null;
  clusterDetails?: ClusterDetails | null;
  personaDetails: PersonaDetails | null;
  isLoading: boolean;
}

export function PersonaCard({ outletName, cluster, clusterDetails, personaDetails, isLoading }: PersonaCardProps) {
  if (isLoading) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Outlet Profile</CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-repgpt-700 rounded"></div>
            <div className="h-4 w-1/2 bg-repgpt-700 rounded"></div>
            <div className="h-4 w-5/6 bg-repgpt-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!outletName || !personaDetails) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Outlet Profile</CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            Select an outlet to see its profile data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {outletName}
        </CardTitle>
        <Users className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Cluster Information */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Cluster</p>
            <p className="text-sm font-medium text-white">{cluster}</p>
          </div>
          
          {/* Cluster Details */}
          {clusterDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clusterDetails.consumption_behavior && (
                <div>
                  <p className="text-xs text-gray-400">Consumption Behavior</p>
                  <p className="text-sm text-gray-300">{clusterDetails.consumption_behavior}</p>
                </div>
              )}
              {clusterDetails.key_occasions && (
                <div>
                  <p className="text-xs text-gray-400">Key Occasions</p>
                  <p className="text-sm text-gray-300">{clusterDetails.key_occasions}</p>
                </div>
              )}
              {clusterDetails.venue_description && (
                <div>
                  <p className="text-xs text-gray-400">Venue Type</p>
                  <p className="text-sm text-gray-300">{clusterDetails.venue_description}</p>
                </div>
              )}
              {clusterDetails.product_focus && (
                <div>
                  <p className="text-xs text-gray-400">Product Focus</p>
                  <p className="text-sm text-gray-300">{clusterDetails.product_focus}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Persona Information */}
          <div>
            <p className="text-xs text-gray-400">Persona Type</p>
            <p className="text-sm font-medium text-white">{personaDetails.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Key Goals</p>
            <p className="text-sm text-gray-300">{personaDetails.goals}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Pain Points</p>
            <p className="text-sm text-gray-300">{personaDetails.pain_points}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
