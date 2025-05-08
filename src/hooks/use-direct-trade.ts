
import { useQuery } from "@tanstack/react-query";
import { postgres } from "@/integrations/postgres/client";

export function useDirectTrade(outletName: string) {
  return useQuery({
    queryKey: ['direct-trade', outletName],
    queryFn: async () => {
      const { data, error } = await postgres
        .from('direct_on_trade')
        .select('*')
        .eq('Outlet', outletName);
        
      if (error) {
        console.error("Error fetching direct trade data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!outletName
  });
}
