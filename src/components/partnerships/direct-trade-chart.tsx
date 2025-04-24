
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface DirectTradeChartProps {
  data: any[];
}

export function DirectTradeChart({ data }: DirectTradeChartProps) {
  // Transform data for the chart
  const chartData = data.reduce((acc: any[], item) => {
    const existingItem = acc.find((i) => i.product === item["PRDHA L5 Individual Variant"]);
    if (existingItem) {
      existingItem.volume += item["Volume HL"];
    } else {
      acc.push({
        product: item["PRDHA L5 Individual Variant"],
        volume: item["Volume HL"]
      });
    }
    return acc;
  }, []);

  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Product Volume Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="product"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}HL`}
                />
                <Tooltip />
                <Bar dataKey="volume" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
