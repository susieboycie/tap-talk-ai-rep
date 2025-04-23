
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PersonaDetails } from "@/hooks/use-persona-details";
import { Users } from "lucide-react";

interface PersonaCardProps {
  outletName: string | null;
  cluster: string | null;
  personaDetails: PersonaDetails | null;
  isLoading: boolean;
}

export function PersonaCard({ outletName, cluster, personaDetails, isLoading }: PersonaCardProps) {
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
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-400">Cluster</p>
            <p className="text-sm font-medium text-white">{cluster}</p>
          </div>
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
