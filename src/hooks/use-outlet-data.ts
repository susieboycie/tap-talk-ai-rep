
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type OutletData = {
  "Outlet Name": string | null;
  "Ship To": number | null;
  "NI or ROI": string | null;
  "Clustered": string | null;
  "Cluster Number": string | null;
  "Outlet Visit Prioritisation": string | null;
  "Geo-Region": string | null;
  "Primary Sales Area": string | null;
  "Global Outlet Channel": string | null;
  "Global Outlet Segment": string | null;
  "Global Outlet Sub Segment": string | null;
  "Consumer Segmentation": string | null;
  "Local Outlet-Segment1": string | null;
  "City": string | null;
  "Credit terms": string | null;
  "Salesforce Record ID": string | null;
};

export function useOutletData(outletName: string | null) {
  return useQuery({
    queryKey: ['outlet-data', outletName],
    queryFn: async () => {
      if (!outletName) return null;
      
      const { data, error } = await supabase
        .from('outlet_data')
        .select('*')
        .eq('Outlet Name', outletName)
        .maybeSingle();

      if (error) {
        console.error("Error fetching outlet data:", error);
        throw error;
      }
      
      return data as OutletData | null;
    },
    enabled: !!outletName,
  });
}
