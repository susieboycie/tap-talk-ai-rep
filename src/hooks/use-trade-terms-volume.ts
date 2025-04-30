
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TradeTermsVolumeData {
  "Outlet Name": string;
  "PRDHA L5 Individual Variant": string;
  "Volume HL": number;
  "Fiscal year/period": string;
  "Ship To": number;
}

export function useTradeTermsVolume(outletName: string | null) {
  return useQuery({
    queryKey: ['trade-terms-volume', outletName],
    queryFn: async () => {
      if (!outletName) return [];
      
      const { data, error } = await supabase
        .from('trade_terms_data')
        .select('*')
        .eq('Outlet Name', outletName);

      if (error) {
        console.error("Error fetching trade terms volume data:", error);
        throw new Error(error.message);
      }
      
      return (data || []) as TradeTermsVolumeData[];
    },
    enabled: !!outletName,
  });
}
