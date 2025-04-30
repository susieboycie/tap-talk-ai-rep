
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Tables } from "@/integrations/supabase/types";
import { Camera, PercentIcon, Hash } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface TraxInsightsProps {
  data: Tables<"trax_data"> | null;
  isLoading: boolean;
}

export function TraxInsights({ data, isLoading }: TraxInsightsProps) {
  if (isLoading) {
    return (
      <Card className="border-purple-700 bg-purple-900/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Loading tap insights...</CardTitle>
          <Camera className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-purple-800 rounded"></div>
            <div className="h-4 w-1/2 bg-purple-800 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-purple-700 bg-purple-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-white">Tap Insights</CardTitle>
          <Camera className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-400">No TRAX data available for this outlet</p>
        </CardContent>
      </Card>
    );
  }

  // Extract beer type distribution data
  const beerTypeData = [
    { name: "Lager", value: data["Share of Lager_Lager_%"] || 0, count: data["Share of Lager_Lager_#"] || 0, color: "#FFD700" },
    { name: "Stout", value: data["Share of Lager_Stout_%"] || 0, count: data["Share of Lager_Stout_#"] || 0, color: "#1A1A1A" },
    { name: "Ale", value: data["Share of Lager_Ale_%"] || 0, count: data["Share of Lager_Ale_#"] || 0, color: "#8B4513" },
    { name: "Cider", value: data["Share of Lager_Cider_%"] || 0, count: data["Share of Lager_Cider_#"] || 0, color: "#32CD32" },
  ];

  // Extract beer presentation data
  const presentationData = [
    { name: "Taps", value: data["Share of Packaged_Beer Taps_%"] || 0, count: data["Share of Packaged_Beer Taps_#"] || 0, color: "#0088FE" },
    { name: "Packaged", value: data["Share of Packaged_Packaged_%"] || 0, count: data["Share of Packaged_Packaged_#"] || 0, color: "#00C49F" },
  ];

  // Extract beverage category data
  const categoryData = [
    { name: "Beer/Cider", value: data["Share of LAD vs. RTD. Vs. Spirits_LAD_%"] || 0, count: data["Share of LAD vs. RTD. Vs. Spirits_LAD_#"] || 0, color: "#FFBB28" },
    { name: "RTD", value: data["Share of LAD vs. RTD. Vs. Spirits_RTD_%"] || 0, count: data["Share of LAD vs. RTD. Vs. Spirits_RTD_#"] || 0, color: "#FF8042" },
    { name: "Spirits", value: data["Share of LAD vs. RTD. Vs. Spirits_Sprits_%"] || 0, count: data["Share of LAD vs. RTD. Vs. Spirits_Sprits_#"] || 0, color: "#8884d8" },
  ];

  // Extract price tier data
  const priceTierData = [
    { name: "Value", value: data["Price Tier Split_Value_%"] || 0, count: data["Price Tier Split_Value_#"] || 0, color: "#a1a1aa" },
    { name: "Standard", value: data["Price Tier Split_Standard_%"] || 0, count: data["Price Tier Split_Standard_#"] || 0, color: "#3b82f6" },
    { name: "Premium", value: data["Price Tier Split_Premium_%"] || 0, count: data["Price Tier Split_Premium_#"] || 0, color: "#10b981" },
    { name: "Super Premium", value: data["Price Tier Split_Super Premium_%"] || 0, count: data["Price Tier Split_Super Premium_#"] || 0, color: "#f59e0b" },
    { name: "Ultra Premium", value: data["Price Tier Split_Ultra Premium_%"] || 0, count: data["Price Tier Split_Ultra Premium_#"] || 0, color: "#ef4444" },
    { name: "Luxury", value: data["Price Tier Split_Luxury_%"] || 0, count: data["Price Tier Split_Luxury_#"] || 0, color: "#8b5cf6" },
  ].filter(item => item.value > 0);
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 rounded shadow-lg border border-gray-700">
          <p className="text-sm font-medium text-white">{data.name}</p>
          <div className="flex items-center gap-1 text-xs">
            <PercentIcon className="h-3 w-3 text-blue-400" /> 
            <span className="text-blue-400">{data.value.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Hash className="h-3 w-3 text-green-400" />
            <span className="text-green-400">{data.count} taps</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalFacings = data["Total Facings"] || 0;

  return (
    <Card className="border-purple-700 bg-purple-900/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-white">Tap Insights</CardTitle>
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-purple-300">{totalFacings} total facings</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Beer Type Distribution</h3>
            <div className="h-[180px]">
              <ChartContainer
                config={{
                  Lager: { color: "#FFD700" },
                  Stout: { color: "#1A1A1A" },
                  Ale: { color: "#8B4513" },
                  Cider: { color: "#32CD32" },
                }}
              >
                {/* Use a fragment to wrap multiple elements as a single child */}
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={beerTypeData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {beerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ChartLegend>
                    <ChartLegendContent payload={beerTypeData.filter(d => d.value > 0).map(item => ({
                      value: item.name,
                      color: item.color
                    }))} />
                  </ChartLegend>
                </>
              </ChartContainer>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Presentation Format</h3>
            <div className="h-[180px]">
              <ChartContainer
                config={{
                  Taps: { color: "#0088FE" },
                  Packaged: { color: "#00C49F" },
                }}
              >
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={presentationData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {presentationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ChartLegend>
                    <ChartLegendContent payload={presentationData.filter(d => d.value > 0).map(item => ({
                      value: item.name,
                      color: item.color
                    }))} />
                  </ChartLegend>
                </>
              </ChartContainer>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Beverage Category Mix</h3>
            <div className="h-[180px]">
              <ChartContainer
                config={{
                  "Beer/Cider": { color: "#FFBB28" },
                  RTD: { color: "#FF8042" },
                  Spirits: { color: "#8884d8" },
                }}
              >
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ChartLegend>
                    <ChartLegendContent payload={categoryData.filter(d => d.value > 0).map(item => ({
                      value: item.name,
                      color: item.color
                    }))} />
                  </ChartLegend>
                </>
              </ChartContainer>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Price Tier Distribution</h3>
            <div className="h-[180px]">
              <ChartContainer
                config={{
                  Value: { color: "#a1a1aa" },
                  Standard: { color: "#3b82f6" },
                  Premium: { color: "#10b981" },
                  "Super Premium": { color: "#f59e0b" },
                  "Ultra Premium": { color: "#ef4444" },
                  Luxury: { color: "#8b5cf6" },
                }}
              >
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priceTierData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priceTierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ChartLegend>
                    <ChartLegendContent payload={priceTierData.map(item => ({
                      value: item.name,
                      color: item.color
                    }))} />
                  </ChartLegend>
                </>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
