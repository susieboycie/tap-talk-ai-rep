
import { useQuery } from "@tanstack/react-query";

// Define a minimal interface for the expected weather data structure
interface WeatherData {
  temperature_max?: number;
  temperature_min?: number;
  precipitation?: number;
  description?: string;
}

export const useOutletWeather = (outletName: string | null, date: string | null) => {
  return useQuery({
    queryKey: ['outlet-weather', outletName, date],
    queryFn: async () => {
      // Since the weather table is no longer available, return null
      console.log("Weather data requested but table is no longer available");
      return null;
    },
    enabled: !!outletName && !!date,
    retry: false
  });
};
