
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jan", volume: 4000, target: 2400, margin: 65 },
  { month: "Feb", volume: 3000, target: 2400, margin: 59 },
  { month: "Mar", volume: 2000, target: 2400, margin: 58 },
  { month: "Apr", volume: 2780, target: 2400, margin: 62 },
  { month: "May", volume: 1890, target: 2400, margin: 65 },
  { month: "Jun", volume: 2390, target: 2400, margin: 64 },
  { month: "Jul", volume: 3490, target: 2400, margin: 63 },
];

export function PerformanceChart() {
  return (
    <Card className="col-span-3 border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-white">Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1A1F2C", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line type="monotone" dataKey="volume" stroke="#9b87f5" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="target" stroke="#ff7300" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
