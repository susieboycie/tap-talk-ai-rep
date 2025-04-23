
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SalesData = Tables<"daily_sales_volume">;

interface PerformanceChartProps {
  data: SalesData[] | null;
  isLoading: boolean;
}

const BEVERAGE_CONFIG = {
  guinness: { name: "Guinness Draught", field: "Guinness_Draught_In_Keg_MTD_Billed", color: "#9b87f5" },
  carlsberg: { name: "Carlsberg Lager", field: "Carlsberg_Lager_In_Keg_MTD_Billed", color: "#ff7300" },
  guinness_zero: { name: "Guinness 0.0", field: "Guinness_Draught_0.0_in_Keg_MTD_Billed", color: "#4CAF50" },
  carlsberg_zero: { name: "Carlsberg 0.0", field: "Carlsberg_0.0_In_Keg_MTD_Billed", color: "#2196F3" },
  harp: { name: "Harp", field: "Harp_In_Keg_MTD_Billed", color: "#FFC107" },
  hophouse: { name: "Hop House 13", field: "Hop_House_13_Lager_MTD_Billed", color: "#FF5722" },
  kilkenny: { name: "Kilkenny", field: "Kilkenny_Draught_In_Keg_MTD_Billed", color: "#E91E63" },
  magners: { name: "Magners", field: "Magners_in_Keg_MTD_Billed", color: "#9C27B0" },
  ogb_citra: { name: "OGB Citra IPA", field: "OGB_Citra_IPA_in_Keg_MTD_Billed", color: "#673AB7" },
  rockshore: { name: "Rockshore", field: "Rockshore_in_Keg_MTD_Billed", color: "#3F51B5" },
  rockshore_apple: { name: "Rockshore Apple", field: "Rockshore_Apple_Cider_in_Keg_MTD_Billed", color: "#009688" },
  smithwicks: { name: "Smithwicks", field: "Smithwicks_In_Keg_MTD_Billed", color: "#795548" },
  smithwicks_pale: { name: "Smithwicks Pale Ale", field: "Smithwicks_Pale_Ale_in_Keg_MTD_Billed", color: "#607D8B" },
  strongbow: { name: "Strongbow", field: "Strongbow_In_Keg_MTD_Billed", color: "#FF9800" },
  tuborg: { name: "Tuborg", field: "Tuborg_Lager_in_Keg_MTD_Billed", color: "#8BC34A" },
};

export function PerformanceChart({ data, isLoading }: PerformanceChartProps) {
  const [dateRange, setDateRange] = useState<number[]>([100]); 
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>(["guinness", "carlsberg"]);
  
  const processedData = data?.map(record => ({
    day: record.Calendar_day,
    ...Object.entries(BEVERAGE_CONFIG).reduce((acc, [key, config]) => ({
      ...acc,
      [key]: record[config.field as keyof SalesData] || 0,
    }), {}),
  })) || [];

  const filteredData = processedData.slice(
    Math.max(0, processedData.length - dateRange[0]),
    processedData.length
  );
  
  const dateRangeText = () => {
    if (!data || data.length === 0) return "No data available";
    const latestDate = new Date(data[data.length - 1]?.Calendar_day || new Date());
    const earliestVisibleDate = new Date(filteredData[0]?.day || latestDate);
    return `${format(earliestVisibleDate, "MMM d, yyyy")} - ${format(latestDate, "MMM d, yyyy")}`;
  };

  const handleBeverageToggle = (beverageId: string) => {
    setSelectedBeverages(prev => 
      prev.includes(beverageId)
        ? prev.filter(id => id !== beverageId)
        : [...prev, beverageId]
    );
  };

  return (
    <Card className="col-span-3 border-repgpt-700 bg-repgpt-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Sales Performance</CardTitle>
        <div className="text-sm text-gray-300">{dateRangeText()}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-white">
            Loading sales data...
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(BEVERAGE_CONFIG).map(([id, config]) => (
                <button
                  key={id}
                  onClick={() => handleBeverageToggle(id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedBeverages.includes(id)
                      ? 'bg-repgpt-400 text-white'
                      : 'bg-repgpt-700 text-gray-400'
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1A1F2C", border: "1px solid #333", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  {selectedBeverages.map(beverageId => {
                    const config = BEVERAGE_CONFIG[beverageId as keyof typeof BEVERAGE_CONFIG];
                    return (
                      <Line
                        key={beverageId}
                        type="monotone"
                        name={config.name}
                        dataKey={beverageId}
                        stroke={config.color}
                        activeDot={{ r: 8 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 px-2">
              <div className="flex justify-between mb-2 text-xs text-gray-400">
                <span>Last {dateRange[0]} days</span>
                <span>All time</span>
              </div>
              <Slider
                value={dateRange}
                min={7}
                max={processedData.length || 100}
                step={1}
                onValueChange={setDateRange}
                className="text-repgpt-400 [&>.bg-primary]:bg-repgpt-400"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
