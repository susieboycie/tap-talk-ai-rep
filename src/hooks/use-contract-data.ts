
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContractData {
  "Outlet Name": string;
  "Contract Start Date": string;
  "Contract End Date": string;
  "Duration": number;
  "Product Name": string;
  "Status": string;
  "Agreement Type": string;
  "Overall Investment(incl. Indirect Inv)": number;
  "Forecast Volume": number;
  "Payment Frequency": string;
  "Product growth-driver": string;
}

export function useContractData(outletName: string | null) {
  return useQuery({
    queryKey: ['contract-data', outletName],
    queryFn: async () => {
      if (!outletName) return [];
      
      const { data, error } = await supabase
        .from('contract_management_beer_data')
        .select('*')
        .eq('Outlet Name', outletName);

      if (error) {
        console.error("Error fetching contract data:", error);
        throw new Error(error.message);
      }
      
      return (data || []) as ContractData[];
    },
    enabled: !!outletName,
  });
}
