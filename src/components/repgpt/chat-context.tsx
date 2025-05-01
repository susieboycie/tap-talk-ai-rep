
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { PersonaDetails } from "@/hooks/use-persona-details";

interface ChatContextProps {
  outletName: string;
  personaDetails: PersonaDetails;
}

export function ChatContext({ outletName, personaDetails }: ChatContextProps) {
  return (
    <Card className="bg-repgpt-800 border-repgpt-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Store className="h-5 w-5" />
          Outlet Context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-white mb-1">{outletName}</h4>
          <p className="text-xs text-gray-400">
            {personaDetails?.name && `Persona: ${personaDetails.name}`}
          </p>
        </div>
        
        <Separator className="bg-repgpt-700" />
        
        {personaDetails?.goals && (
          <div>
            <h4 className="text-sm font-medium text-repgpt-300 mb-1">Goals</h4>
            <p className="text-xs text-gray-300">{personaDetails.goals}</p>
          </div>
        )}
        
        {personaDetails?.pain_points && (
          <div>
            <h4 className="text-sm font-medium text-repgpt-300 mb-1">Pain Points</h4>
            <p className="text-xs text-gray-300">{personaDetails.pain_points}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
