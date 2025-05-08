
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useOutletWeather = (outletName: string | null, date: string | null) => {
  return useQuery({
    queryKey: ['outlet-weather', outletName, date],
    queryFn: async () => {
      if (!outletName || !date) return null;
      
      console.log(`Fetching weather data for ${outletName} on ${date}`);
      
      // First try to get cached weather data
      const { data: existingData, error: fetchError } = await supabase
        .from('daily_weather')
        .select('*')
        .eq('outlet_name', outletName)
        .eq('date', date)
        .maybeSingle() as any;

      if (fetchError) {
        console.error("Error fetching weather data:", fetchError);
        throw fetchError;
      }

      if (existingData) {
        console.log("Found cached weather data:", existingData);
        return existingData;
      }

      console.log("No cached weather data found, fetching from API...");
      
      // If no cached data, fetch new weather data
      try {
        const { data: weatherData, error } = await supabase.functions.invoke('fetch-weather', {
          body: {
            outlet: outletName,
            date: format(new Date(date), 'yyyy-MM-dd')
          }
        });

        if (error) {
          console.error("Error fetching new weather data:", error);
          throw error;
        }

        console.log("Successfully fetched new weather data:", weatherData);
        return weatherData;
      } catch (error) {
        console.error("Exception while fetching weather:", error);
        // Return null instead of throwing to prevent UI from breaking
        return null;
      }
    },
    enabled: !!outletName && !!date,
    retry: 1
  });
};
