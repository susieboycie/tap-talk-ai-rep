
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useSalesVolumeData = (outletName: string | null) => {
  return useQuery({
    queryKey: ['sales-volume-data', outletName],
    queryFn: async () => {
      if (!outletName) return [];
      
      console.log("Fetching sales volume data for outlet:", outletName);
      
      const { data, error } = await supabase
        .from('sales_volume_data')
        .select('*')
        .eq('Outlet Name', outletName);

      if (error) {
        console.error("Error fetching sales volume data:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No sales volume data found for outlet:", outletName);
        return [];
      }
      
      console.log("Fetched sales volume data:", data.length, "records");
      return data;
    },
    enabled: !!outletName,
  });
};
