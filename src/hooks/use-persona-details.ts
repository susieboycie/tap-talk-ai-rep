
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOutletData, type OutletData } from "./use-outlet-data";

export interface PersonaDetails {
  name: string;
  goals: string;
  pain_points: string;
  diageo_value?: string | null;
  id?: string | null;
}

export interface ClusterDetails {
  name: string;
  venue_description: string | null;
  consumption_behavior: string | null;
  key_occasions: string | null;
  product_focus: string | null;
  price_tier: string | null;
  location_type: string | null;
  universe_percent: string | null;
  nsv_percent: string | null;
  id: string | null;
}

export function usePersonaDetails(outletName: string | null) {
  // First, fetch the outlet data to get the cluster number
  const { data: outletData } = useOutletData(outletName);
  
  // Map clusters to personas
  const mapClusterToPersona = (clusterNumber: string | null): string => {
    if (!clusterNumber) return "The Support Seeker";
    
    const clusterNum = parseInt(clusterNumber);
    if (isNaN(clusterNum)) return "The Support Seeker";
    
    // Map cluster numbers to persona types
    if (clusterNum >= 1 && clusterNum <= 3) return "The Entrepreneur";
    if (clusterNum >= 4 && clusterNum <= 6) return "The Deal Maker";
    if (clusterNum >= 7 && clusterNum <= 9) return "The Pragmatist";
    return "The Support Seeker";
  };
  
  // Fetch persona details
  const { data: personaData, isLoading: isPersonaLoading } = useQuery({
    queryKey: ['persona-details', outletData?.["Cluster Number"]],
    queryFn: async () => {
      if (!outletData) return null;
      
      const personaName = mapClusterToPersona(outletData["Cluster Number"]);
      
      const { data, error } = await supabase
        .from('persona_details')
        .select('*')
        .eq('name', personaName)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching persona details:", error);
        throw error;
      }
      
      return data as PersonaDetails;
    },
    enabled: !!outletData
  });
  
  // Fetch cluster details
  const { data: clusterData } = useQuery({
    queryKey: ['cluster-details', outletData?.["Cluster Number"]],
    queryFn: async () => {
      if (!outletData?.["Cluster Number"]) return null;
      
      const { data, error } = await supabase
        .from('cluster_details')
        .select('*')
        .eq('name', outletData["Cluster Number"])
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching cluster details:", error);
        throw error;
      }
      
      return data as ClusterDetails;
    },
    enabled: !!outletData?.["Cluster Number"]
  });

  return {
    personaDetails: personaData || null,
    clusterType: outletData?.["Cluster Number"] || null,
    clusterDetails: clusterData || null,
    isLoading: isPersonaLoading
  };
}
