
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, CloudRain, Sun, Thermometer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useOutletWeather } from "@/hooks/use-outlet-weather";

interface SalesInsightsProps {
  data: any[] | null;
  isLoading: boolean;
}

export function SalesInsights({ data, isLoading }: SalesInsightsProps) {
  if (isLoading) {
    return (
      <Card className="border-blue-700 bg-blue-900/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-300">Loading insights...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-blue-800 rounded"></div>
            <div className="h-4 w-1/2 bg-blue-800 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-blue-700 bg-blue-900/30">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-300">Sales Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-400">No sales data available</p>
        </CardContent>
      </Card>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.Calendar_day).getTime() - new Date(b.Calendar_day).getTime()
  );

  const latestDate = sortedData[sortedData.length - 1]?.Calendar_day;
  const latestOutlet = sortedData[sortedData.length - 1]?.["Outlet Name"];

  const { data: weatherData, isLoading: isWeatherLoading } = useOutletWeather(latestOutlet, latestDate);

  // Get last 14 days of data
  const last14Days = sortedData.slice(-14);
  const lastWeekData = last14Days.slice(-7);
  const previousWeekData = last14Days.slice(0, 7);

  const calculateAverageVolume = (weekData: typeof data) => {
    const beverages = {
      guinness: 'Guinness_Draught_In_Keg_MTD_Billed',
      carlsberg: 'Carlsberg_Lager_In_Keg_MTD_Billed',
      zeroAlc: ['Guinness_Draught_0.0_in_Keg_MTD_Billed', 'Carlsberg_0.0_In_Keg_MTD_Billed']
    };

    return {
      guinness: weekData.reduce((sum, day) => sum + (day[beverages.guinness] || 0), 0),
      carlsberg: weekData.reduce((sum, day) => sum + (day[beverages.carlsberg] || 0), 0),
      zeroAlc: weekData.reduce((sum, day) => 
        sum + beverages.zeroAlc.reduce((total, field) => 
          total + Number(day[field as keyof typeof day] || 0), 
        0), 
      0)
    };
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const lastWeekVolumes = calculateAverageVolume(lastWeekData);
  const previousWeekVolumes = calculateAverageVolume(previousWeekData);

  const guinnessTrend = getPercentageChange(
    lastWeekVolumes.guinness,
    previousWeekVolumes.guinness
  );

  const carlsbergTrend = getPercentageChange(
    lastWeekVolumes.carlsberg,
    previousWeekVolumes.carlsberg
  );

  const zeroAlcTrend = getPercentageChange(
    lastWeekVolumes.zeroAlc,
    previousWeekVolumes.zeroAlc
  );

  const latestDateObj = new Date(sortedData[sortedData.length - 1]?.Calendar_day || new Date());
  const timeAgo = formatDistanceToNow(latestDateObj, { addSuffix: true });

  return (
    <Card className="border-blue-700 bg-blue-900/30">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-white">7-Day Sales Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather section */}
        {isWeatherLoading ? (
          <div className="flex items-center gap-2 p-2 rounded-md bg-blue-800/30">
            <div className="animate-pulse flex items-center gap-2 text-sm text-blue-300">
              <div className="h-4 w-4 bg-blue-700 rounded-full"></div>
              <div className="h-4 w-24 bg-blue-700 rounded"></div>
            </div>
          </div>
        ) : weatherData ? (
          <div className="flex items-center gap-2 p-2 bg-blue-800/30 rounded-md">
            {weatherData.description.includes("rain") || weatherData.description.includes("drizzle") ? (
              <CloudRain className="h-4 w-4 text-blue-300" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-300" />
            )}
            <span className="text-sm font-medium text-gray-200 capitalize">{weatherData.description}</span>
            <Thermometer className="h-4 w-4 ml-2 text-red-300" />
            <span className="text-sm font-medium text-gray-200">{weatherData.temperature_max}°C</span>
          </div>
        ) : null}
        
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

        <p className="text-xs text-blue-400 mt-4">
          Comparing last 7 days vs previous 7 days. Last updated {timeAgo}.
        </p>
      </CardContent>
    </Card>
  );
}
