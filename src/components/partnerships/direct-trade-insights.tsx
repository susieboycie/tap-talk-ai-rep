
import { Card, CardContent } from "@/components/ui/card";

interface DirectTradeInsightsProps {
  directTradeData: any[];
}

export function DirectTradeInsights({ directTradeData }: DirectTradeInsightsProps) {
  // Add a guard clause to handle undefined or empty data
  if (!directTradeData || directTradeData.length === 0) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800 mb-6">
        <CardContent className="pt-6">
          <p className="text-gray-300 leading-relaxed">
            No performance data available. Please select an outlet with data to view insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get the first record to display insights
  const record = directTradeData[0];
  
  // Calculate completion percentages for available metrics
  const guinness0Completion = record["GNS 0.0 Target"] ? 
    Math.round((record["GNS 0.0 Ach"] / record["GNS 0.0 Target"]) * 100) : 0;
  
  const rockshoreWaveCompletion = record["RS WAVE Target"] ? 
    Math.round((record["RS WAVE Ach"] / record["RS WAVE Target"]) * 100) : 0;
  
  const smiceCompletion = record["SMICE Target"] ? 
    Math.round((record["SMICE Ach"] / record["SMICE Target"]) * 100) : 0;
  
  const casamigosCompletion = record["Casa Target"] ? 
    Math.round((record["Casa Ach"] / record["Casa Target"]) * 100) : 0;

  return (
    <Card className="border-repgpt-700 bg-repgpt-800 mb-6">
      <CardContent className="pt-6">
        <p className="text-gray-300 leading-relaxed">
          <span className="font-semibold text-white">Performance Summary for {record["Outlet Name"]}</span><br/>
          Guinness 0.0: <span className="font-semibold text-white">{record["GNS 0.0 Ach"] || 0}/{record["GNS 0.0 Target"] || 0}</span> ({guinness0Completion}% completion)<br/>
          Rockshore Wave: <span className="font-semibold text-white">{record["RS WAVE Ach"] || 0}/{record["RS WAVE Target"] || 0}</span> ({rockshoreWaveCompletion}% completion)<br/>
          Smirnoff Ice: <span className="font-semibold text-white">{record["SMICE Ach"] || 0}/{record["SMICE Target"] || 0}</span> ({smiceCompletion}% completion)<br/>
          Casamigos: <span className="font-semibold text-white">{record["Casa Ach"] || 0}/{record["Casa Target"] || 0}</span> ({casamigosCompletion}% completion)<br/>
          Rockshore Activations: <span className="font-semibold text-white">{record["RSL Activations"] || 0}</span>
        </p>
      </CardContent>
    </Card>
  );
}
