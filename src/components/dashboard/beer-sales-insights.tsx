
import { useSalesVolumeData } from "@/hooks/use-sales-volume-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Beer, TrendingUp, AlertTriangle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface BeerSalesInsightsProps {
  outletName: string | null;
}

export function BeerSalesInsights({ outletName }: BeerSalesInsightsProps) {
  const { data: salesData, isLoading, error } = useSalesVolumeData(outletName);
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading beer sales data",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
      console.error("Beer sales data error:", error);
    }
  }, [error, toast]);

  // No outlet selected case
  if (!outletName) {
    return (
      <Card className="border-amber-700 bg-amber-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Beer Sales Breakdown</CardTitle>
          <Beer className="h-5 w-5 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-amber-400">Please select an outlet to view beer sales data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <div className="h-[300px] flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
            <p className="text-amber-300 text-center">No beer sales data available for {outletName || "this outlet"}.</p>
            <p className="text-amber-400/70 text-sm text-center">Try selecting a different outlet from the dropdown above.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group data by fiscal year
  // Define beer categories based on the columns in the sales_volume_data table
  const beerCategories = [
    { name: "Guinness Draught", key: "Guinness Draught (Stout)", color: "#D946EF" },
    { name: "Carlsberg", key: "Carlsberg (Lager)", color: "#43A047" },
    { name: "Rockshore", key: "Rockshore (Lager)", color: "#1E88E5" },
    { name: "Smithwick's", key: "Smithwick's (Ale)", color: "#D81B60" },
    { name: "Hop House 13", key: "Hop House 13", color: "#FFC107" },
    { name: "Guinness 0.0", key: "Guinness Non Alc (Non Alc Stout)", color: "#7E57C2" },
  ];

  // Process data for visualization - ensure we handle possible nulls/undefined values
  const chartData = salesData.map(item => {
    const year = item.fiscal_year ? String(item.fiscal_year).substring(0, 7) : "Unknown";
    
    const result: any = { name: year };
    beerCategories.forEach(category => {
      const value = item[category.key as keyof typeof item] || 0;
      // Ensure value is a number before using toFixed
      result[category.name] = typeof value === 'number' ? Number(value.toFixed(1)) : 0;
    });
    
    return result;
  });

  // If we have no data points after processing, show empty state
  if (chartData.length === 0) {
    return (
      <Card className="border-amber-700 bg-amber-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Beer Sales Breakdown</CardTitle>
          <Beer className="h-5 w-5 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-amber-300">No processable beer sales data found for {outletName}.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  // Check if we actually have any sales volumes
  const hasSalesData = growthTrends.some(item => item.volume > 0);
  if (!hasSalesData) {
    return (
      <Card className="border-amber-700 bg-amber-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Beer Sales Breakdown</CardTitle>
          <Beer className="h-5 w-5 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
            <p className="text-amber-300 text-center">No sales volumes recorded for {outletName || "this outlet"}.</p>
            <p className="text-amber-400/70 text-sm text-center">All beer categories show zero volume.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate natural language insights
  const generateTextInsights = () => {
    // Find top and bottom performing products
    const topPerformer = [...growthTrends].sort((a, b) => b.growth - a.growth)[0];
    const bottomPerformer = [...growthTrends].filter(item => item.volume > 0).sort((a, b) => a.growth - b.growth)[0];
    
    // Calculate total volume
    const totalVolume = growthTrends.reduce((sum, item) => sum + item.volume, 0);
    
    // Get active products (with volume > 0)
    const activeProducts = growthTrends.filter(item => item.volume > 0);
    
    // Calculate market share percentages
    const marketShareData = activeProducts.map(item => ({
      ...item,
      share: (item.volume / totalVolume) * 100
    }));
    
    // Get dominant product (highest volume)
    const dominantProduct = marketShareData[0]; // Already sorted by volume
    
    // Build insights text
    let insights = `${outletName} primarily sells ${dominantProduct.name} (${dominantProduct.share.toFixed(1)}% of total volume)`;
    
    if (marketShareData.length > 1) {
      insights += `, followed by ${marketShareData[1].name} (${marketShareData[1].share.toFixed(1)}%)`;
    }
    
    insights += `. `;
    
    // Add growth trend insights
    if (topPerformer && topPerformer.growth !== 0) {
      insights += `${topPerformer.name} is showing the strongest growth at ${topPerformer.growth > 0 ? '+' : ''}${topPerformer.growth.toFixed(1)}%. `;
    }
    
    if (bottomPerformer && bottomPerformer.growth < 0) {
      insights += `${bottomPerformer.name} is underperforming with ${bottomPerformer.growth.toFixed(1)}% change. `;
    }
    
    // Product mix insights
    const stoutShare = marketShareData.filter(item => item.name.includes("Guinness")).reduce((sum, item) => sum + item.share, 0);
    const lagerShare = marketShareData.filter(item => !item.name.includes("Guinness") && !item.name.includes("Smithwick")).reduce((sum, item) => sum + item.share, 0);
    
    if (stoutShare > 50) {
      insights += `This is a stout-dominant outlet. `;
    } else if (lagerShare > 50) {
      insights += `This is a lager-dominant outlet. `;
    } else {
      insights += `This outlet has a balanced product mix. `;
    }
    
    // Non-alcoholic insights
    const nonAlcShare = marketShareData.filter(item => item.name.includes("0.0")).reduce((sum, item) => sum + item.share, 0);
    if (nonAlcShare > 5) {
      insights += `There is significant non-alcoholic beer sales (${nonAlcShare.toFixed(1)}% of volume). `;
    }
    
    // Period-to-period trend
    if (chartData.length > 1) {
      const overallTrend = totalVolume - growthTrends.reduce((sum, item) => sum + (firstPeriod[item.name] || 0), 0);
      const overallPercent = (overallTrend / growthTrends.reduce((sum, item) => sum + (firstPeriod[item.name] || 0), 0)) * 100;
      
      if (Math.abs(overallPercent) > 5) {
        insights += `Overall, this outlet's beer sales have ${overallPercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(overallPercent).toFixed(1)}% from ${chartData[0].name} to ${chartData[chartData.length - 1].name}.`;
      } else {
        insights += `Overall beer sales have remained relatively stable over the analyzed periods.`;
      }
    }
    
    return insights;
  };

  const textInsights = generateTextInsights();

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
        {/* Natural Language Insights */}
        <div className="bg-amber-900/50 p-4 rounded-md border border-amber-700">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-amber-400" />
            <h3 className="text-white font-medium">Key Insights</h3>
          </div>
          <p className="text-amber-100 text-sm">{textInsights}</p>
        </div>

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
