
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
            No direct trade data available. Please select an outlet with data to view insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate insights
  const totalVolume = directTradeData.reduce((sum, item) => sum + (Number(item["Volume HL"]) || 0), 0);
  const productCounts = directTradeData.reduce((acc: { [key: string]: number }, item) => {
    const product = item["PRDHA L5 Individual Variant"] || "Unknown";
    acc[product] = (acc[product] || 0) + (Number(item["Volume HL"]) || 0);
    return acc;
  }, {});

  // Find the top product
  const topProductEntries = Object.entries(productCounts).sort(([, a], [, b]) => b - a);
  const topProduct = topProductEntries.length > 0 ? topProductEntries[0] : ["No product", 0];
  
  // Calculate trends
  const months = [...new Set(directTradeData.map(item => 
    item["Fiscal year/period"] ? new Date(item["Fiscal year/period"]).toISOString().substring(0, 7) : null
  ))].filter(Boolean).sort();
  
  let trendMessage = "";
  if (months.length > 1) {
    const recentMonthsData = directTradeData.filter(item => 
      item["Fiscal year/period"] && 
      new Date(item["Fiscal year/period"]).toISOString().substring(0, 7) === months[months.length - 1]
    );
    const previousMonthsData = directTradeData.filter(item => 
      item["Fiscal year/period"] && 
      new Date(item["Fiscal year/period"]).toISOString().substring(0, 7) === months[months.length - 2]
    );
    
    const recentVolume = recentMonthsData.reduce((sum, item) => sum + (Number(item["Volume HL"]) || 0), 0);
    const previousVolume = previousMonthsData.reduce((sum, item) => sum + (Number(item["Volume HL"]) || 0), 0);
    
    if (previousVolume > 0) {
      if (recentVolume > previousVolume) {
        // Convert to numbers explicitly and calculate the percentage change
        const percentChange = ((Number(recentVolume) / Number(previousVolume)) - 1) * 100;
        trendMessage = ` Volume is trending upward with a ${percentChange.toFixed(1)}% increase from the previous period.`;
      } else if (recentVolume < previousVolume) {
        // Convert to numbers explicitly and calculate the percentage change
        const percentChange = ((1 - (Number(recentVolume) / Number(previousVolume))) * 100);
        trendMessage = ` Volume is trending downward with a ${percentChange.toFixed(1)}% decrease from the previous period.`;
      } else {
        trendMessage = " Volume is stable compared to the previous period.";
      }
    }
  }

  return (
    <Card className="border-repgpt-700 bg-repgpt-800 mb-6">
      <CardContent className="pt-6">
        <p className="text-gray-300 leading-relaxed">
          Your total direct trade volume is <span className="font-semibold text-white">{totalVolume.toFixed(2)} HL</span>.
          The leading product is <span className="font-semibold text-white">{topProduct[0]}</span> with{" "}
          <span className="font-semibold text-white">{Number(topProduct[1]).toFixed(2)} HL</span> in volume.
          {trendMessage && <span>{trendMessage}</span>}
        </p>
      </CardContent>
    </Card>
  );
}
