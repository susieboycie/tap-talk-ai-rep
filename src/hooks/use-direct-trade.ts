
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define a type for the expected return data
interface DirectTradeData {
  [key: string]: any;
  Outlet?: string;
}

export function useDirectTrade(outletName: string) {
  return useQuery({
    queryKey: ['direct-trade', outletName],
    queryFn: async () => {
      // Use type assertion with PostgrestResponse to avoid TypeScript errors
      const { data, error } = await supabase
        .from('direct_on_trade')
        .select('*')
        .eq('Outlet', outletName) as {
          data: DirectTradeData[] | null;
          error: Error | null;
        };
        
      if (error) {
        console.error("Error fetching direct trade data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!outletName
  });
}
