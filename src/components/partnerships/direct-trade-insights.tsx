
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, CheckCheck, Users } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface DirectTradeInsightsProps {
  directTradeData: Tables<"target_tiering_data">[];
}

export function DirectTradeInsights({ directTradeData }: DirectTradeInsightsProps) {
  // Extract data from the first record
  const data = directTradeData[0];
  
  // Calculate percentages for achievements vs targets
  const guinessPercentage = data["GNS 0.0 Target"] ? Math.round((data["GNS 0.0 Ach"] / data["GNS 0.0 Target"]) * 100) : 0;
  const rockshorePercentage = data["RS WAVE Target"] ? Math.round((data["RS WAVE Ach"] / data["RS WAVE Target"]) * 100) : 0;
  const casamigosPercentage = data["Casa Target"] ? Math.round((data["Casa Ach"] / data["Casa Target"]) * 100) : 0;
  const smirnoffPercentage = data["SMICE Target"] ? Math.round((data["SMICE Ach"] / data["SMICE Target"]) * 100) : 0;
  
  // Call Compliance is already multiplied by 100 in the hook
  const callCompliancePercentage = data["Compliance Ach"] ? Number(data["Compliance Ach"].toFixed(1)) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card className="border-blue-500/20 bg-blue-500/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/20 p-2">
              <CheckCheck className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-500">Call Compliance</p>
              <h3 className="text-2xl font-bold text-white">{callCompliancePercentage.toFixed(1)}%</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-500/20 bg-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-500/20 p-2">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-500">Days in Trade</p>
              <h3 className="text-2xl font-bold text-white">{(data["DIT Ach"] || 0).toFixed(1)} / {(data["DIT Target"] || 0).toFixed(1)} days</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-500/20 bg-green-500/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-500/20 p-2">
              <BarChart className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-500">Rockshore Activations</p>
              <h3 className="text-2xl font-bold text-white">{(data["RSL Activations"] || 0).toFixed(1)}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Achievement Rate Notifications */}
      <div className="xl:col-span-3 grid gap-4">
        {guinessPercentage < 70 && (
          <Alert variant="destructive">
            <AlertDescription>
              Guinness 0.0 is underperforming at {guinessPercentage.toFixed(1)}% of target. Consider promotional activities.
            </AlertDescription>
          </Alert>
        )}
        
        {rockshorePercentage < 70 && (
          <Alert variant="destructive">
            <AlertDescription>
              Rockshore Wave is underperforming at {rockshorePercentage.toFixed(1)}% of target. Consider increasing visibility.
            </AlertDescription>
          </Alert>
        )}
        
        {casamigosPercentage < 70 && (
          <Alert variant="destructive">
            <AlertDescription>
              Casamigos is underperforming at {casamigosPercentage.toFixed(1)}% of target. Review pricing strategy.
            </AlertDescription>
          </Alert>
        )}
        
        {smirnoffPercentage < 70 && (
          <Alert variant="destructive">
            <AlertDescription>
              Smirnoff Ice is underperforming at {smirnoffPercentage.toFixed(1)}% of target. Consider bundle offers.
            </AlertDescription>
          </Alert>
        )}
        
        {callCompliancePercentage < 60 && (
          <Alert variant="destructive">
            <AlertDescription>
              Call compliance is low at {callCompliancePercentage.toFixed(1)}%. Schedule more visits to improve relationship.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
