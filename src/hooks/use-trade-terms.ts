
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
      
      // Using a hardcoded array of trade terms for now since there's no trade_terms table
      // This is a placeholder that would typically fetch from a real table
      const mockTradeTerms: TradeTermItem[] = [
        {
          id: "1",
          outlet_name: outletName,
          term_name: "Annual Volume Rebate",
          amount: 5000,
          start_date: "2025-01-01",
          end_date: "2025-12-31",
          status: "Active"
        },
        {
          id: "2",
          outlet_name: outletName,
          term_name: "Promotional Discount",
          amount: 1200,
          start_date: "2025-03-01",
          end_date: "2025-06-30",
          status: "Active"
        },
        {
          id: "3",
          outlet_name: outletName,
          term_name: "Summer Campaign",
          amount: 3500,
          start_date: "2024-06-01",
          end_date: "2025-08-31",
          status: "Expiring Soon"
        }
      ];
      
      return mockTradeTerms;
    },
    enabled: !!outletName,
  });
}
