
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type SalesData = Tables<"daily_sales_volume">;

interface PerformanceChartProps {
  data: SalesData[] | null;
  isLoading: boolean;
}

export function PerformanceChart({ data, isLoading }: PerformanceChartProps) {
  const processedData = data?.map(record => ({
    day: record.Calendar_day,
    guinness: record.Guinness_Draught_In_Keg_MTD_Billed || 0,
    carlsberg: record.Carlsberg_Lager_In_Keg_MTD_Billed || 0,
    guinness_zero: record.Guinness_Draught_0_0_in_Keg_MTD_Billed || 0,
    carlsberg_zero: record.Carlsberg_0_0_In_Keg_MTD_Billed || 0,
  })) || [];

  return (
    <Card className="col-span-3 border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-white">Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-white">
            Loading sales data...
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processedData}
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
                <Line type="monotone" name="Guinness" dataKey="guinness" stroke="#9b87f5" activeDot={{ r: 8 }} />
                <Line type="monotone" name="Carlsberg" dataKey="carlsberg" stroke="#ff7300" activeDot={{ r: 8 }} />
                <Line type="monotone" name="Guinness 0.0" dataKey="guinness_zero" stroke="#4CAF50" activeDot={{ r: 8 }} />
                <Line type="monotone" name="Carlsberg 0.0" dataKey="carlsberg_zero" stroke="#2196F3" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
