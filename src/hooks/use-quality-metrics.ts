
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
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

// Sample data to use when no database data is available
const sampleMetricsData = [
  {
    "Rep ID": "RE5001",
    "Compliance Ach": 0.85,
    "CPD Ach": 6.8,
    "CPD Target": 7.5,
    "DIT Ach": 28,
    "DIT Target": 30,
    "GNS 0.0 Ach": 18,
    "GNS 0.0 Target": 20,
    "RS WAVE Ach": 15,
    "RS WAVE Target": 17,
    "RSL Activations": 12,
    "SMICE Ach": 25,
    "SMICE Target": 30,
    "Casa Ach": 8,
    "Casa Target": 10
  }
];

export function useQualityMetrics(repId: string | null) {
  // Use React Query to fetch data from target_tiering_data based on Rep ID
  const { data, isLoading, error } = useQuery({
    queryKey: ['quality-metrics-by-rep', repId],
    queryFn: async () => {
      if (!repId) {
        console.log("No Rep ID provided");
        return null;
      }
      
      console.log("Fetching quality metrics for Rep:", repId);
      
      const { data: repData, error } = await supabase
        .from('target_tiering_data')
        .select('*')
        .eq('Rep ID', repId);

      if (error) {
        console.error("Error fetching rep tiering data:", error);
        throw error;
      }

      console.log("Retrieved rep tiering data:", repData);
      
      if (!repData || repData.length === 0) {
        console.log("No tiering data found for Rep:", repId);
        // Return sample data if no data found
        return sampleMetricsData;
      }
      
      // We can return all the data and process it later
      return repData;
    },
    enabled: !!repId
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

  // Process the rep data to calculate aggregate metrics
  const processRepData = (repData: any[]): QualityMetrics => {
    if (!repData || repData.length === 0) return defaultMetrics;
    
    // Calculate averages for percentage-based metrics
    const callComplianceAvg = repData.reduce((sum, item) => sum + (item["Compliance Ach"] || 0), 0) / repData.length * 100;
    const callsPerDayAvg = repData.reduce((sum, item) => sum + (item["CPD Ach"] || 0), 0) / repData.length;
    const daysInTradeAvg = repData.reduce((sum, item) => sum + (item["DIT Ach"] || 0), 0) / repData.length;
    
    // Sum up for accumulation metrics
    const guinnessTgt = repData.reduce((sum, item) => sum + (item["GNS 0.0 Target"] || 0), 0);
    const guinnessAch = repData.reduce((sum, item) => sum + (item["GNS 0.0 Ach"] || 0), 0);
    
    const rockshoreDistTgt = repData.reduce((sum, item) => sum + (item["RS WAVE Target"] || 0), 0);
    const rockshoreDistAch = repData.reduce((sum, item) => sum + (item["RS WAVE Ach"] || 0), 0);
    
    const rockshoreActivations = repData.reduce((sum, item) => sum + (item["RSL Activations"] || 0), 0);
    
    const smirnoffTgt = repData.reduce((sum, item) => sum + (item["SMICE Target"] || 0), 0);
    const smirnoffAch = repData.reduce((sum, item) => sum + (item["SMICE Ach"] || 0), 0);
    
    const casamigosTgt = repData.reduce((sum, item) => sum + (item["Casa Target"] || 0), 0);
    const casamigosAch = repData.reduce((sum, item) => sum + (item["Casa Ach"] || 0), 0);
    
    // Get average targets
    const cpdTarget = repData.reduce((sum, item) => sum + (item["CPD Target"] || 0), 0) / repData.length;
    const ditTarget = repData.reduce((sum, item) => sum + (item["DIT Target"] || 0), 0) / repData.length;
    
    return {
      callCompliance: callComplianceAvg,
      callsPerDay: callsPerDayAvg,
      daysInTrade: daysInTradeAvg,
      cpdTarget,
      ditTarget,
      guinness: { 
        target: guinnessTgt, 
        actual: guinnessAch 
      },
      rockshoreDistribution: { 
        target: rockshoreDistTgt, 
        actual: rockshoreDistAch 
      },
      rockshoreActivations,
      smirnoffIce: { 
        target: smirnoffTgt, 
        actual: smirnoffAch
      },
      casamigos: { 
        target: casamigosTgt, 
        actual: casamigosAch 
      }
    };
  };

  // Transform the data from Supabase into our metrics format
  const metrics = data ? processRepData(data) : defaultMetrics;

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
