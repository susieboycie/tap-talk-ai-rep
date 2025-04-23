
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useOutletWeather = (outletName: string | null, date: string | null) => {
  return useQuery({
    queryKey: ['outlet-weather', outletName, date],
    queryFn: async () => {
      if (!outletName || !date) return null;
      
      // First try to get cached weather data
      const { data: existingData, error: fetchError } = await supabase
        .from('daily_weather')
        .select('*')
        .eq('outlet_name', outletName)
        .eq('date', date)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching weather data:", fetchError);
        throw fetchError;
      }

      if (existingData) {
        return existingData;
      }

      // If no cached data, fetch new weather data
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

      return weatherData;
    },
    enabled: !!outletName && !!date
  });
};
