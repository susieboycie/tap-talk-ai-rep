
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Default rep ID for quality page
const DEFAULT_REP_ID = "RE5001";

export function useRepData() {
  const [selectedRep, setSelectedRep] = useState<string | null>(DEFAULT_REP_ID);
  
  const { data: repIds, isLoading: isLoadingReps } = useQuery({
    queryKey: ['rep-ids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('target_tiering_data')
        .select('distinct "Rep ID"')
        .order('"Rep ID"');
        
      if (error) {
        console.error("Error fetching Rep IDs:", error);
        throw error;
      }

      // Extract unique rep IDs
      const uniqueReps = Array.from(new Set(data.map(row => row['Rep ID']))) as string[];
      return uniqueReps.filter(Boolean);
    }
  });

  return {
    repIds,
    selectedRep,
    setSelectedRep,
    isLoadingReps
  };
}
