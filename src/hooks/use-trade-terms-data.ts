
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type TradeTermData = Tables<"target_tiering_data">;

export function useTradeTermsData(outletName: string | null) {
  return useQuery({
    queryKey: ['trade-terms-data', outletName],
    queryFn: async () => {
      if (!outletName) return [] as TradeTermData[];
      
      const { data, error } = await supabase
        .from('target_tiering_data')
        .select('*')
        .eq('Outlet Name', outletName);

      if (error) {
        console.error("Error fetching trade terms data:", error);
        throw new Error(error.message);
      }
      
      // Convert decimal compliance values to percentages before returning
      const formattedData = data?.map(item => ({
        ...item,
        "Compliance Ach": (item["Compliance Ach"] || 0) * 100
      }));
      
      return (formattedData || []) as TradeTermData[];
    },
    enabled: !!outletName,
  });
}
