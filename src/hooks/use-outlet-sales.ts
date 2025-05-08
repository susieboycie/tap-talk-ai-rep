
import { db } from "@/integrations/postgres/migration-helper";
import { useQuery } from "@tanstack/react-query";

export const useOutletSales = (outletName: string | null) => {
  return useQuery({
    queryKey: ['outlet-sales', outletName],
    queryFn: async () => {
      if (!outletName) return [];
      
      console.log("Fetching sales data for outlet:", outletName);
      
      const { data, error } = await db
        .from('daily_sales_volume')
        .select('*')
        .eq('Outlet', outletName)
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
