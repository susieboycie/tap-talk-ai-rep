
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TradeTermItem {
  id: string;
  outlet_name: string;
  term_name: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: string;
}

export function useTradeTerms(outletName: string | null) {
  return useQuery<TradeTermItem[]>({
    queryKey: ['trade-terms', outletName],
    queryFn: async () => {
      if (!outletName) return [] as TradeTermItem[];
      
      const { data, error } = await supabase
        .from('trade_terms')
        .select('*')
        .eq('outlet_name', outletName);

      if (error) {
        console.error("Error fetching trade terms:", error);
        throw new Error(error.message);
      }
      
      return (data || []) as TradeTermItem[];
    },
    enabled: !!outletName,
  });
}
