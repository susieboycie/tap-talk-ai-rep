
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useOutletSales = (outletName: string | null) => {
  return useQuery({
    queryKey: ['outlet-sales', outletName],
    queryFn: async () => {
      if (!outletName) return null;
      
      const { data, error } = await supabase
        .from('daily_sales_volume')
        .select('*')
        .eq('Outlet', outletName)
        .order('Calendar_day', { ascending: true });

      if (error) {
        console.error("Error fetching sales data:", error);
        throw error;
      }
      
      console.log("Fetched sales data:", data);
      return data;
    },
    enabled: !!outletName,
  });
};
