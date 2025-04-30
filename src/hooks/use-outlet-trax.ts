
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useOutlet } from "@/contexts/outlet-context";

export function useOutletTrax(outletName: string | null) {
  return useQuery({
    queryKey: ["trax-data", outletName],
    queryFn: async () => {
      if (!outletName) {
        return null;
      }
      
      const { data, error } = await supabase
        .from("trax_data")
        .select("*")
        .eq("Outlet Name", outletName)
        .single();
        
      if (error) {
        console.error("Error fetching TRAX data:", error);
        return null;
      }

      // Process percentage fields - multiply by 100
      const processedData = { ...data };
      
      // Process all percentage fields (those that have a % in the column name)
      Object.keys(processedData).forEach(key => {
        if (key.includes('%') && typeof processedData[key] === 'number') {
          processedData[key] = processedData[key] * 100;
        }
      });
      
      return processedData as Tables<"trax_data">;
    },
    enabled: !!outletName,
  });
}
