
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface SalesInsightsProps {
  data: Tables<"daily_sales_volume">[] | null;
  isLoading: boolean;
}

export function SalesInsights({ data, isLoading }: SalesInsightsProps) {
  if (isLoading) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Loading insights...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-repgpt-700 rounded"></div>
            <div className="h-4 w-1/2 bg-repgpt-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-repgpt-700 bg-repgpt-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-300">Sales Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">No sales data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate insights
  const sortedData = [...data].sort((a, b) => 
    new Date(a.Calendar_day).getTime() - new Date(b.Calendar_day).getTime()
  );

  const latestData = sortedData[sortedData.length - 1];
  const previousData = sortedData[sortedData.length - 2];

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const guinnessTrend = getPercentageChange(
    latestData.Guinness_Draught_In_Keg_MTD_Billed || 0,
    previousData?.Guinness_Draught_In_Keg_MTD_Billed || 0
  );

  const carlsbergTrend = getPercentageChange(
    latestData.Carlsberg_Lager_In_Keg_MTD_Billed || 0,
    previousData?.Carlsberg_Lager_In_Keg_MTD_Billed || 0
  );

  const zeroAlcTrend = getPercentageChange(
    (latestData.Guinness_Draught_0_0_in_Keg_MTD_Billed || 0) + (latestData.Carlsberg_0_0_In_Keg_MTD_Billed || 0),
    (previousData?.Guinness_Draught_0_0_in_Keg_MTD_Billed || 0) + (previousData?.Carlsberg_0_0_In_Keg_MTD_Billed || 0)
  );

  return (
    <Card className="border-repgpt-700 bg-repgpt-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-white">Sales Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {guinnessTrend !== 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Guinness Draught</span>
              <div className="flex items-center gap-1">
                {guinnessTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${guinnessTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(guinnessTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
          
          {carlsbergTrend !== 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Carlsberg Lager</span>
              <div className="flex items-center gap-1">
                {carlsbergTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${carlsbergTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(carlsbergTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          )}

          {zeroAlcTrend !== 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Non-Alcoholic</span>
              <div className="flex items-center gap-1">
                {zeroAlcTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${zeroAlcTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(zeroAlcTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Showing trends based on the most recent data compared to previous period.
        </p>
      </CardContent>
    </Card>
  );
}
