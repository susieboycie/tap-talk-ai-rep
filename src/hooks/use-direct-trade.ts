
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDirectTrade(outletName: string) {
  return useQuery({
    queryKey: ['direct-trade', outletName],
    queryFn: async () => {
      // Using a more generic approach to avoid TS errors with undefined tables
      const { data, error } = await supabase
        .from('direct_on_trade')
        .select('*')
        .eq('Outlet', outletName) as any;
        
      if (error) {
        console.error("Error fetching direct trade data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!outletName
  });
}
