
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useOutletData } from "@/hooks/use-outlet-data";
import { useQuery } from "@tanstack/react-query";

export interface QualityMetrics {
  callCompliance: number;
  callsPerDay: number;
  daysInTrade: number;
  cpdTarget: number;
  ditTarget: number;
  guinness: {
    target: number;
    actual: number;
  };
  rockshoreDistribution: {
    target: number;
    actual: number;
  };
  rockshoreActivations: number;
  smirnoffIce: {
    target: number;
    actual: number;
  };
  casamigos: {
    target: number;
    actual: number;
  };
}

export function useQualityMetrics(outletName: string | null) {
  const { data: outletData } = useOutletData(outletName);
  
  // Use React Query to fetch data from target_tiering_data
  const { data, isLoading, error } = useQuery({
    queryKey: ['quality-metrics', outletName, outletData?.["Ship To"]],
    queryFn: async () => {
      if (!outletData?.["Ship To"]) {
        console.log("No Ship To found for outlet:", outletName);
        return null;
      }
      
      const shipTo = outletData["Ship To"];
      
      console.log("Fetching quality metrics for Ship To:", shipTo);
      
      const { data: tierData, error } = await supabase
        .from('target_tiering_data')
        .select('*')
        .eq('Ship To', shipTo)
        .maybeSingle();

      if (error) {
        console.error("Error fetching target tiering data:", error);
        throw error;
      }

      console.log("Retrieved target tiering data:", tierData);
      
      if (!tierData) {
        console.log("No target tiering data found for Ship To:", shipTo);
        // Return default values if no data found
        return null;
      }
      
      return tierData;
    },
    enabled: !!outletData?.["Ship To"]
  });

  // Default values fallback
  const defaultMetrics: QualityMetrics = {
    callCompliance: 0,
    callsPerDay: 0,
    daysInTrade: 0,
    cpdTarget: 7.5,
    ditTarget: 30,
    guinness: { target: 0, actual: 0 },
    rockshoreDistribution: { target: 0, actual: 0 },
    rockshoreActivations: 0,
    smirnoffIce: { target: 0, actual: 0 },
    casamigos: { target: 0, actual: 0 }
  };

  // Transform the data from Supabase into our metrics format
  const metrics = data ? {
    callCompliance: data["Compliance Ach"] || 0,
    callsPerDay: data["CPD Ach"] || 0,
    daysInTrade: data["DIT Ach"] || 0,
    cpdTarget: data["CPD Target"] || 7.5,
    ditTarget: data["DIT Target"] || 30,
    guinness: { 
      target: data["GNS 0.0 Target"] || 0, 
      actual: data["GNS 0.0 Ach"] || 0 
    },
    rockshoreDistribution: { 
      target: data["RS WAVE Target"] || 0, 
      actual: data["RS WAVE Ach"] || 0 
    },
    rockshoreActivations: data["RSL Activations"] || 0,
    smirnoffIce: { 
      target: data["SMICE Target"] || 0, 
      actual: data["SMICE Ach"] || 0 
    },
    casamigos: { 
      target: data["Casa Target"] || 0, 
      actual: data["Casa Ach"] || 0 
    }
  } : defaultMetrics;

  const getRAGStatus = (value: number, metric: keyof QualityMetrics): "red" | "amber" | "green" => {
    switch (metric) {
      case "callCompliance":
        return value >= 80 ? "green" : value >= 60 ? "amber" : "red";
      case "callsPerDay":
        return value >= metrics.cpdTarget ? "green" : value >= metrics.cpdTarget * 0.8 ? "amber" : "red";
      case "daysInTrade":
        return value >= metrics.ditTarget ? "green" : value >= metrics.ditTarget * 0.8 ? "amber" : "red";
      default:
        return "amber";
    }
  };

  const getProductRAGStatus = (actual: number, target: number): "red" | "amber" | "green" => {
    if (target === 0) return "amber"; // Can't calculate percentage if target is 0
    const percentage = (actual / target) * 100;
    return percentage >= 90 ? "green" : percentage >= 70 ? "amber" : "red";
  };

  return {
    metrics,
    getRAGStatus,
    getProductRAGStatus,
    isLoading,
    error
  };
}
