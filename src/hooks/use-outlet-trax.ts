
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
      
      return data as Tables<"trax_data">;
    },
    enabled: !!outletName,
  });
}
