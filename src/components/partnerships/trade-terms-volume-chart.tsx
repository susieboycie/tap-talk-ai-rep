
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TradeTermsVolumeData } from "@/hooks/use-trade-terms-volume";

interface TradeTermsVolumeChartProps {
  data: TradeTermsVolumeData[];
}

export function TradeTermsVolumeChart({ data }: TradeTermsVolumeChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-400">No volume data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Process data for the chart by grouping by product variant
  const productMap = new Map<string, number>();
  
  data.forEach(item => {
    const product = item["PRDHA L5 Individual Variant"];
    const volume = item["Volume HL"] || 0;
    
    if (productMap.has(product)) {
      productMap.set(product, productMap.get(product)! + volume);
    } else {
      productMap.set(product, volume);
    }
  });
  
  // Convert map to array for chart data
  const chartData = Array.from(productMap, ([name, volume]) => ({ 
    name: name.length > 20 ? `${name.substring(0, 20)}...` : name, 
    volume: parseFloat(volume.toFixed(2))
  }));
  
  // Sort by volume descending
  chartData.sort((a, b) => b.volume - a.volume);
  
  // Take top 10 products
  const topProducts = chartData.slice(0, 10);
  
  // Calculate total volume
  const totalVolume = chartData.reduce((sum, item) => sum + item.volume, 0);
  
  // Format custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const volumeValue = payload[0].value;
      const percentage = ((volumeValue / totalVolume) * 100).toFixed(1);
      
      return (
        <div className="bg-repgpt-900 border border-repgpt-700 p-3 rounded-md shadow-md">
          <p className="font-medium text-white">{label}</p>
          <p className="text-gray-300">Volume: {volumeValue.toFixed(2)} HL</p>
          <p className="text-gray-300">Share: {percentage}%</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Product Volume Distribution</CardTitle>
        <p className="text-gray-400">Top 10 products by volume</p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#888888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                label={{ value: 'Volume (HL)', angle: -90, position: 'insideLeft', fill: '#888888' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="volume" name="Volume (HL)" fill="#9b87f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
