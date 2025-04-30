
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ActivationStatus = {
  "Activation Name": string | null;
  "Activation Status": string | null;
  "Date Activated": string | null;
  "Outlet Name": string | null;
  "Ship To": number | null;
};

export function useActivationStatus(outletName: string | null) {
  return useQuery({
    queryKey: ['activation-status', outletName],
    queryFn: async () => {
      let query = supabase
        .from('activations_data')
        .select('*');

      if (outletName) {
        query = query.eq('Outlet Name', outletName);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching activation status data:", error);
        throw error;
      }
      
      return data as ActivationStatus[];
    },
    enabled: true, // Fetch even if outletName is null to show all activations
  });
}
