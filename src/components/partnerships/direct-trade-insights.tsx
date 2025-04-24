
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface DirectTradeInsightsProps {
  directTradeData: any[];
}

export function DirectTradeInsights({ directTradeData }: DirectTradeInsightsProps) {
  // Calculate insights
  const totalVolume = directTradeData.reduce((sum, item) => sum + item["Volume HL"], 0);
  const productCounts = directTradeData.reduce((acc: { [key: string]: number }, item) => {
    acc[item["PRDHA L5 Individual Variant"]] = (acc[item["PRDHA L5 Individual Variant"]] || 0) + item["Volume HL"];
    return acc;
  }, {});

  const topProduct = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <Card className="border-repgpt-700 bg-repgpt-800 mb-6">
      <CardContent className="pt-6">
        <p className="text-gray-300 leading-relaxed">
          Your total direct trade volume is <span className="font-semibold text-white">{totalVolume.toFixed(2)} HL</span>.
          The leading product is <span className="font-semibold text-white">{topProduct[0]}</span> with{" "}
          <span className="font-semibold text-white">{topProduct[1].toFixed(2)} HL</span> in volume.
        </p>
      </CardContent>
    </Card>
  );
}
