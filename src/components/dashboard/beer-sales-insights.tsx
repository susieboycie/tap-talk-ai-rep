
import { useOutletSales } from "@/hooks/use-outlet-sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { Beer, TrendingUp } from "lucide-react";

interface BeerSalesInsightsProps {
  outletName: string | null;
}

export function BeerSalesInsights({ outletName }: BeerSalesInsightsProps) {
  const { data: salesData, isLoading } = useOutletSales(outletName);

  if (isLoading) {
    return (
      <Card className="border-amber-700 bg-amber-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Beer Sales Breakdown</CardTitle>
          <Beer className="h-5 w-5 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-amber-400">Loading sales data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!salesData || salesData.length === 0) {
    return (
      <Card className="border-amber-700 bg-amber-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Beer Sales Breakdown</CardTitle>
          <Beer className="h-5 w-5 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-amber-300">No sales data available for this outlet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group data by fiscal year and sum up volumes
  const beerCategories = [
    { name: "Guinness Draught", key: "Guinness_Draught_In_Keg_MTD_Billed", color: "#2E1A47" },
    { name: "Carlsberg Lager", key: "Carlsberg_Lager_In_Keg_MTD_Billed", color: "#43A047" },
    { name: "Rockshore", key: "Rockshore_in_Keg_MTD_Billed", color: "#1E88E5" },
    { name: "Smithwick's", key: "Smithwicks_In_Keg_MTD_Billed", color: "#D81B60" },
    { name: "Hop House 13", key: "Hop_House_13_Lager_MTD_Billed", color: "#FFC107" },
    { name: "Guinness 0.0", key: "Guinness_Draught_0.0_in_Keg_MTD_Billed", color: "#7E57C2" },
  ];

  // Process data for visualization
  const chartData = salesData.map(item => {
    const year = item.Calendar_day ? format(new Date(item.Calendar_day), "MMM yyyy") : "Unknown";
    
    const result: any = { name: year };
    beerCategories.forEach(category => {
      const value = item[category.key as keyof typeof item] || 0;
      result[category.name] = Number(value.toFixed(1));
    });
    
    return result;
  });

  // Calculate growth trends
  const firstPeriod = chartData[0] || {};
  const lastPeriod = chartData[chartData.length - 1] || {};

  const growthTrends = beerCategories.map(category => {
    const firstValue = firstPeriod[category.name] || 0;
    const lastValue = lastPeriod[category.name] || 0;
    
    const growthPercent = firstValue > 0 
      ? ((lastValue - firstValue) / firstValue * 100)
      : (lastValue > 0 ? 100 : 0);
    
    return {
      name: category.name,
      growth: growthPercent,
      volume: lastValue,
      color: category.color
    };
  }).sort((a, b) => b.volume - a.volume);

  return (
    <Card className="border-amber-700 bg-amber-900/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Beer Sales Breakdown</CardTitle>
          <p className="text-sm text-amber-400 mt-1">
            {chartData.length} periods from {chartData[0]?.name} to {chartData[chartData.length - 1]?.name}
          </p>
        </div>
        <Beer className="h-5 w-5 text-amber-400" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sales Volume Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4e3a10" />
              <XAxis dataKey="name" stroke="#FFD700" />
              <YAxis stroke="#FFD700" />
              <Tooltip
                contentStyle={{ backgroundColor: "#422D0D", border: "1px solid #765B17", borderRadius: "8px" }}
                itemStyle={{ color: "#FFD700" }}
                labelStyle={{ color: "#FFFFFF" }}
                formatter={(value: any) => [`${value.toFixed(1)} HL`, ""]}
              />
              <Legend wrapperStyle={{ color: "#FFD700" }} />
              {beerCategories.map(category => (
                <Bar
                  key={category.name}
                  dataKey={category.name}
                  name={category.name}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Trends Section */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-amber-400" /> Volume Trends
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {growthTrends.map((item) => (
              <div 
                key={item.name} 
                className="bg-amber-900/50 p-3 rounded-md border border-amber-800/50"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <h4 className="text-amber-200 text-sm font-medium">{item.name}</h4>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-white font-mono text-lg">
                    {item.volume.toFixed(1)} HL
                  </span>
                  <span className={`text-sm font-medium ${
                    item.growth > 0 ? 'text-green-400' : 
                    item.growth < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
