
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type PersonaDetails = {
  id: string;
  name: string;
  goals: string;
  pain_points: string;
  diageo_value: string;
}

export type ClusterDetails = {
  name: string;
  consumption_behavior: string | null;
  key_occasions: string | null;
  venue_description: string | null;
  product_focus: string | null;
  location_type: string | null;
  price_tier: string | null;
}

export const usePersonaDetails = (outletName: string | null) => {
  // Store the cluster type once we've fetched it
  const [clusterType, setClusterType] = useState<string | null>(null);
  const [clusterDetails, setClusterDetails] = useState<ClusterDetails | null>(null);

  // First get the cluster information for the outlet
  const clusterQuery = useQuery({
    queryKey: ['outlet-cluster', outletName],
    queryFn: async () => {
      if (!outletName) return null;
      
      const { data, error } = await supabase
        .from('daily_sales_volume')
        .select('Cluster')
        .eq('Outlet', outletName)
        .limit(1);
      
      if (error) {
        console.error("Error fetching cluster for outlet:", error);
        throw error;
      }
      
      const clusterName = data.length > 0 ? data[0].Cluster : null;
      console.log("Outlet cluster:", clusterName);
      setClusterType(clusterName);
      return clusterName;
    },
    enabled: !!outletName,
  });

  // Fetch cluster details when we have a cluster name
  const clusterDetailsQuery = useQuery({
    queryKey: ['cluster-details', clusterType],
    queryFn: async () => {
      if (!clusterType) return null;
      
      const { data, error } = await supabase
        .from('cluster_details')
        .select('*')
        .eq('name', clusterType)
        .limit(1);
      
      if (error) {
        console.error("Error fetching cluster details:", error);
        throw error;
      }
      
      const details = data.length > 0 ? data[0] as ClusterDetails : null;
      setClusterDetails(details);
      return details;
    },
    enabled: !!clusterType,
  });

  // Then fetch the persona details based on the cluster
  const personaQuery = useQuery({
    queryKey: ['persona-details', clusterType],
    queryFn: async () => {
      if (!clusterType) return null;
      
      // In a real app, you'd map cluster to persona type
      // For now, we'll just fetch based on cluster name or a default
      const personaName = mapClusterToPersona(clusterType);
      
      const { data, error } = await supabase
        .from('persona_details')
        .select('*')
        .eq('name', personaName)
        .limit(1);
      
      if (error) {
        console.error("Error fetching persona details:", error);
        throw error;
      }
      
      return data.length > 0 ? data[0] as PersonaDetails : null;
    },
    enabled: !!clusterType,
  });

  return {
    isLoading: clusterQuery.isLoading || personaQuery.isLoading || clusterDetailsQuery.isLoading,
    clusterType,
    clusterDetails,
    personaDetails: personaQuery.data,
    error: clusterQuery.error || personaQuery.error || clusterDetailsQuery.error,
  };
};

// Helper function to map cluster types to persona types
// This is a simplified mapping - in a real app you'd have more sophisticated logic
const mapClusterToPersona = (clusterType: string): string => {
  const clusterMapping: Record<string, string> = {
    'Neighbourhood Pub': 'The Pragmatist',
    'Urban Bar': 'The Entrepreneur',
    'Town Bar': 'The Support Seeker',
    'City Centre': 'The Deal Maker'
  };
  
  return clusterMapping[clusterType] || 'The Support Seeker'; // Default persona
};
