
import { useActivationStatus, ActivationStatus } from "@/hooks/use-activation-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Activity,
  CalendarClock,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Tooltip as UITooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ActivationStatusInsightsProps {
  outletName: string | null;
}

export function ActivationStatusInsights({ outletName }: ActivationStatusInsightsProps) {
  const { data: activationData, isLoading, error } = useActivationStatus(outletName);
  const [selectedView, setSelectedView] = useState<'chart' | 'cards'>('cards');
  
  // Group activations by name
  const groupedActivations = useMemo(() => {
    if (!activationData || activationData.length === 0) return {};
    
    return activationData.reduce((acc: Record<string, ActivationStatus[]>, activation) => {
      const name = activation["Activation Name"] || "Unnamed";
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(activation);
      return acc;
    }, {});
  }, [activationData]);

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
  
  // Format activation date
  const formatActivationDate = (dateString: string | null) => {
    if (!dateString) return "Not available";
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };
  
  // Prepare data for chart
  const prepareChartData = () => {
    const statusCounts: Record<string, number> = {};
    
    activationData?.forEach(item => {
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
            Cards
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
              <BarChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4e3a60" />
                <XAxis dataKey="name" stroke="#E5DEFF" />
                <YAxis stroke="#E5DEFF" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" name="Activations">
                  {prepareChartData().map((entry, index) => (
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-[300px] overflow-y-auto pr-2">
            {Object.entries(groupedActivations).map(([activationName, activations]) => (
              <ActivationCard 
                key={activationName}
                name={activationName}
                activations={activations}
                getStatusIcon={getStatusIcon}
                formatActivationDate={formatActivationDate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ActivationCardProps {
  name: string;
  activations: ActivationStatus[];
  getStatusIcon: (status: string | null) => JSX.Element;
  formatActivationDate: (date: string | null) => string;
}

function ActivationCard({ name, activations, getStatusIcon, formatActivationDate }: ActivationCardProps) {
  return (
    <Card className="border-purple-700/50 bg-purple-950/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium text-white">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {activations.map((activation, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-purple-900/30 rounded-md">
              <span className="text-sm text-purple-200">
                {activation["Outlet Name"] || "Unknown Outlet"}
              </span>
              <div className="flex gap-2 items-center">
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <Info className="h-4 w-4 mr-1 text-purple-400" />
                        <span className="text-xs text-purple-400">
                          {activation["Activation Status"]?.toLowerCase() === 'active' 
                            ? formatActivationDate(activation["Date Activated"])
                            : 'Not activated'
                          }
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-purple-800 text-white border-purple-700">
                      <div className="flex flex-col">
                        <span className="font-medium">Status: {activation["Activation Status"]}</span>
                        {activation["Date Activated"] && (
                          <span>Activated on: {formatActivationDate(activation["Date Activated"])}</span>
                        )}
                      </div>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
                <StatusIndicator status={activation["Activation Status"]} />
                {getStatusIcon(activation["Activation Status"])}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatusIndicatorProps {
  status: string | null;
}

function StatusIndicator({ status }: StatusIndicatorProps) {
  const isActive = status?.toLowerCase() === 'active';
  
  return (
    <span 
      className={`inline-block w-16 h-8 rounded-full relative ${isActive ? 'bg-green-500/20' : 'bg-red-500/20'} border ${isActive ? 'border-green-500' : 'border-red-500'}`}
    >
      <span 
        className={`absolute inset-1 mx-1 rounded-full ${isActive ? 'bg-green-500 ml-auto right-1' : 'bg-red-500 left-1'}`}
      />
      <span 
        className={`absolute inset-0 flex items-center justify-${isActive ? 'end' : 'start'} px-2 text-xs font-medium ${isActive ? 'text-green-500' : 'text-red-500'}`}
      >
        {isActive ? 'Yes' : 'No'}
      </span>
    </span>
  );
}
