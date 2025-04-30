
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Define the TradeTermData type without creating a recursive reference
export type TradeTermData = {
  "Outlet Name": string;
  "Ship To": number;
  "PRDHA L5 Individual Variant": string;
  "Volume HL": number;
  "Fiscal year/period": string | Date;
};

export function useTradeTermsData(outletName: string | null) {
  return useQuery({
    queryKey: ['trade-terms-data', outletName],
    queryFn: async () => {
      if (!outletName) return [] as TradeTermData[];
      
      const { data, error } = await supabase
        .from('trade_terms_data')
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
