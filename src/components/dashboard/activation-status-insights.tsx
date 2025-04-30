
import { useActivationStatus, ActivationStatus } from "@/hooks/use-activation-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Activity,
  CalendarClock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";

interface ActivationStatusInsightsProps {
  outletName: string | null;
}

export function ActivationStatusInsights({ outletName }: ActivationStatusInsightsProps) {
  const { data: activationData, isLoading, error } = useActivationStatus(outletName);
  const [selectedView, setSelectedView] = useState<'chart' | 'cards'>('chart');
  
  // Helper function to get status icon
  const getStatusIcon = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'scheduled':
        return <CalendarClock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Get badge color based on status
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return "bg-green-500/20 text-green-700 border-green-600";
      case 'inactive':
        return "bg-red-500/20 text-red-700 border-red-600";
      case 'pending':
        return "bg-amber-500/20 text-amber-700 border-amber-600";
      case 'scheduled':
        return "bg-blue-500/20 text-blue-700 border-blue-600";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-600";
    }
  };

  // Prepare data for chart
  const prepareChartData = () => {
    const statusCounts: Record<string, number> = {};
    
    activationData.forEach(item => {
      const status = item["Activation Status"]?.toLowerCase() || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({ 
      name: status.charAt(0).toUpperCase() + status.slice(1), 
      value: count 
    }));
  };
  
  // Get color for chart bars
  const getChartColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return '#10B981';
      case 'inactive': return '#EF4444';
      case 'pending': return '#F59E0B';
      case 'scheduled': return '#3B82F6';
      default: return '#9CA3AF';
    }
  };
  
  if (isLoading) {
    return (
      <Card className="border-purple-700 bg-purple-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Activation Status</CardTitle>
          <Activity className="h-5 w-5 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-purple-400">Loading activation data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !activationData || activationData.length === 0) {
    return (
      <Card className="border-purple-700 bg-purple-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Activation Status</CardTitle>
          <Activity className="h-5 w-5 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-purple-400" />
            <p className="text-purple-300 text-center">
              {error ? "Error loading activation data" : 
                `No activation data available for ${outletName || "this outlet"}.`}
            </p>
            <p className="text-purple-400/70 text-sm text-center">
              {error ? "Please try again or contact support." : 
                "Try selecting a different outlet from the dropdown above."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const chartData = prepareChartData();
  
  return (
    <Card className="border-purple-700 bg-purple-900/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Activation Status</CardTitle>
          <p className="text-sm text-purple-400 mt-1">
            {activationData.length} activations for {outletName || "all outlets"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            className={`cursor-pointer ${selectedView === 'chart' ? 'bg-purple-500' : 'bg-purple-900'}`}
            onClick={() => setSelectedView('chart')}
          >
            Chart
          </Badge>
          <Badge 
            className={`cursor-pointer ${selectedView === 'cards' ? 'bg-purple-500' : 'bg-purple-900'}`}
            onClick={() => setSelectedView('cards')}
          >
            Details
          </Badge>
          <Activity className="h-5 w-5 text-purple-400" />
        </div>
      </CardHeader>
      <CardContent>
        {selectedView === 'chart' ? (
          <div className="h-[300px]">
            <ChartContainer 
              config={{
                active: { color: '#10B981' },
                inactive: { color: '#EF4444' },
                pending: { color: '#F59E0B' },
                scheduled: { color: '#3B82F6' },
                unknown: { color: '#9CA3AF' },
              }}
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4e3a60" />
                <XAxis dataKey="name" stroke="#E5DEFF" />
                <YAxis stroke="#E5DEFF" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" name="Activations">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getChartColor(entry.name)} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {activationData.map((activation, index) => (
              <div 
                key={index}
                className="p-4 bg-purple-900/50 border border-purple-800 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-white">{activation["Activation Name"] || "Unnamed Activation"}</h3>
                  <p className="text-sm text-purple-300">{activation["Outlet Name"] || "Unknown Outlet"}</p>
                </div>
                <Badge className={getStatusColor(activation["Activation Status"])}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(activation["Activation Status"])}
                    {activation["Activation Status"] || "Unknown"}
                  </span>
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
