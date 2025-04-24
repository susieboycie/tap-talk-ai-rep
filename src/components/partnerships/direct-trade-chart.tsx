
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface DirectTradeChartProps {
  data: any[];
}

export function DirectTradeChart({ data }: DirectTradeChartProps) {
  // Check if data is valid
  if (!data || data.length === 0) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Product Volume Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-400">No data available to display chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.reduce((acc: any[], item) => {
    // Skip items without product info
    if (!item["PRDHA L5 Individual Variant"]) return acc;
    
    const existingItem = acc.find((i) => i.product === item["PRDHA L5 Individual Variant"]);
    if (existingItem) {
      existingItem.volume += item["Volume HL"] || 0;
    } else {
      acc.push({
        product: item["PRDHA L5 Individual Variant"],
        volume: item["Volume HL"] || 0
      });
    }
    return acc;
  }, []);

  // If we end up with no chart data after filtering
  if (chartData.length === 0) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Product Volume Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-400">No valid product data available to display chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Product Volume Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={{
              volume: {
                color: "#9b87f5"
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                <XAxis 
                  dataKey="product"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={100}
                  dy={20}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}HL`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom tooltip for better readability
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-repgpt-900 border border-repgpt-700 p-3 rounded-md shadow-lg">
      <p className="font-medium text-white">{payload[0].payload.product}</p>
      <p className="text-gray-300">{`Volume: ${payload[0].value.toFixed(2)} HL`}</p>
    </div>
  );
}
