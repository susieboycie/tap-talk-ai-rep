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
import { 
  Tooltip as UITooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useMemo } from "react";

interface ActivationStatusInsightsProps {
  outletName: string | null;
}

export function ActivationStatusInsights({ outletName }: ActivationStatusInsightsProps) {
  const { data: activationData, isLoading, error } = useActivationStatus(outletName);
  
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
      case 'y':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
      case 'n':
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
  
  // No outlet selected
  if (!outletName) {
    return (
      <Card className="border-purple-700 bg-purple-900/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Activation Status</CardTitle>
          <Activity className="h-5 w-5 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-purple-400">Please select an outlet to view activation data.</p>
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
            {outletName || "All outlets"}
          </p>
        </div>
        <Activity className="h-5 w-5 text-purple-400" />
      </CardHeader>
      <CardContent>
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
              <div className="flex gap-2 items-center">
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <Info className="h-4 w-4 mr-1 text-purple-400" />
                        <span className="text-xs text-purple-400">
                          {(activation["Activation Status"]?.toLowerCase() === 'active' || 
                            activation["Activation Status"]?.toLowerCase() === 'y') 
                            ? formatActivationDate(activation["Date Activated"])
                            : 'Not activated'
                          }
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-purple-800 text-white border-purple-700">
                      <div className="flex flex-col">
                        <span className="font-medium">Status: {(activation["Activation Status"]?.toLowerCase() === 'y') ? 'Activated' : activation["Activation Status"]}</span>
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
  const isActive = status?.toLowerCase() === 'active' || status?.toLowerCase() === 'y';
  
  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full relative cursor-help ${
            isActive ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
          }`}>
            <div className={`w-5 h-5 rounded-full ${
              isActive ? 'bg-green-500' : 'bg-red-500'
            }`} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-purple-800 text-white border-purple-700">
          <div className="flex flex-col">
            <span className="font-medium">{isActive ? 'Activated' : 'Not Activated'}</span>
          </div>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
}
