
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface TradeTermItem {
  id: string;
  customer: string;
  startDate: string;
  endDate: string;
  status: string;
  daysRemaining: number;
  complianceStatus: string;
  volume: string;
  rebate: string;
  shipTo?: number | null;
}

export function useTradeTerms(outletName: string | null) {
  return useQuery({
    queryKey: ['trade-terms', outletName],
    queryFn: async (): Promise<TradeTermItem[]> => {
      if (!outletName) return [];

      // First get the Ship To from the outlet_data table
      const { data: outletData, error: outletError } = await supabase
        .from('outlet_data')
        .select('"Ship To"')
        .eq('"Outlet Name"', outletName)
        .maybeSingle();

      if (outletError) {
        console.error("Error fetching outlet data:", outletError);
        throw outletError;
      }

      if (!outletData || !outletData["Ship To"]) {
        console.log("No Ship To found for outlet:", outletName);
        return [];
      }

      const shipTo = outletData["Ship To"];

      // Now fetch trade terms data for this Ship To
      const { data, error } = await supabase
        .from('trade_terms_data')
        .select('*')
        .eq('Ship To', shipTo);

      if (error) {
        console.error("Error fetching trade terms data:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Process and transform the data
      return data.map((item, index) => {
        // Parse dates from the fiscal year/period
        const fiscalDate = new Date(item["Fiscal year/period"] || "");
        const startDate = new Date(fiscalDate);
        const endDate = new Date(fiscalDate);
        endDate.setFullYear(endDate.getFullYear() + 1); // Assuming 1-year terms
        
        // Calculate days remaining
        const today = new Date();
        const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Determine status based on days remaining
        let status = "Active";
        if (daysRemaining <= 0) {
          status = "Expired";
        } else if (daysRemaining <= 90) {
          status = "Expiring Soon";
        }
        
        // Determine compliance status (simplified for demo)
        const volumeTarget = item["Volume HL"] || 0;
        const compliancePercentage = Math.random() * 100; // In a real app, this would be calculated from actual data
        let complianceStatus = "Compliant";
        if (compliancePercentage < 70) {
          complianceStatus = "Non-compliant";
        } else if (compliancePercentage < 90) {
          complianceStatus = "At Risk";
        }

        // Calculate rebate (simplified)
        const rebatePercentage = Math.floor(Math.random() * 5) + 1; // 1-5%
        
        return {
          id: String(index + 1),
          customer: outletName,
          startDate: startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          endDate: endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          status,
          daysRemaining,
          complianceStatus,
          volume: `${Math.round(volumeTarget)} HL/year`,
          rebate: `${rebatePercentage}%`,
          shipTo
        };
      });
    },
    enabled: !!outletName,
  });
}
