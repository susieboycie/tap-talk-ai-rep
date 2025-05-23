
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";

interface DirectTradeChartProps {
  data: any[];
}

export function DirectTradeChart({ data }: DirectTradeChartProps) {
  // Check if data is valid
  if (!data || data.length === 0) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Product Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-400">No data available to display chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform the data for the chart
  const chartData = [
    {
      name: "Guinness 0.0",
      target: data[0]["GNS 0.0 Target"] || 0,
      achievement: data[0]["GNS 0.0 Ach"] || 0,
      completion: data[0]["GNS 0.0 Target"] 
        ? Math.round((data[0]["GNS 0.0 Ach"] / data[0]["GNS 0.0 Target"]) * 100)
        : 0
    },
    {
      name: "Rockshore Wave",
      target: data[0]["RS WAVE Target"] || 0,
      achievement: data[0]["RS WAVE Ach"] || 0,
      completion: data[0]["RS WAVE Target"] 
        ? Math.round((data[0]["RS WAVE Ach"] / data[0]["RS WAVE Target"]) * 100)
        : 0
    },
    {
      name: "Smirnoff Ice",
      target: data[0]["SMICE Target"] || 0,
      achievement: data[0]["SMICE Ach"] || 0,
      completion: data[0]["SMICE Target"] 
        ? Math.round((data[0]["SMICE Ach"] / data[0]["SMICE Target"]) * 100)
        : 0
    },
    {
      name: "Casamigos",
      target: data[0]["Casa Target"] || 0,
      achievement: data[0]["Casa Ach"] || 0,
      completion: data[0]["Casa Target"] 
        ? Math.round((data[0]["Casa Ach"] / data[0]["Casa Target"]) * 100)
        : 0
    }
  ];

  // Define chart config
  const chartConfig = {
    target: {
      label: "Target"
    },
    achievement: {
      label: "Achievement"
    }
  };

  // Custom tooltip for better readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    // Find the completion percentage for this product
    const currentData = chartData.find(item => item.name === label);
    const completionPercentage = currentData?.completion || 0;
    
    return (
      <div className="bg-repgpt-900 border border-repgpt-700 p-3 rounded-md shadow-lg">
        <p className="font-medium text-white">{label}</p>
        <p className="text-gray-300">{`Target: ${payload[0].value}`}</p>
        <p className="text-gray-300">{`Achievement: ${payload[1].value}`}</p>
        <p className={`font-medium ${
          completionPercentage >= 100 ? "text-green-400" : 
          completionPercentage >= 75 ? "text-yellow-400" : "text-red-400"
        }`}>{`Completion: ${completionPercentage}%`}</p>
      </div>
    );
  };

  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Target vs Achievement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <XAxis 
                dataKey="name"
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
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="target" name="Target" fill="#4b5563" radius={[4, 4, 0, 0]} />
              <Bar dataKey="achievement" name="Achievement" fill="#9b87f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
