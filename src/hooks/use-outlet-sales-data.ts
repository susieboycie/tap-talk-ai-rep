
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useOutletSalesData = (outletName: string | null) => {
  return useQuery({
    queryKey: ['outlet-sales-data', outletName],
    queryFn: async () => {
      if (!outletName) return [];
      
      console.log("Fetching sales data for outlet from daily_sales_data:", outletName);
      
      const { data, error } = await supabase
        .from('daily_sales_data')
        .select('*')
        .eq('Outlet Name', outletName)
        .order('Calendar_day', { ascending: true });

      if (error) {
        console.error("Error fetching sales data:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No sales data found for outlet:", outletName);
        return [];
      }
      
      console.log("Fetched sales data:", data.length, "records");
      return data;
    },
    enabled: !!outletName,
  });
};
