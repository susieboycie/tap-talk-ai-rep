
import { useState } from 'react';

export interface QualityMetrics {
  callCompliance: number;
  callsPerDay: number;
  daysInTrade: number;
}

export function useQualityMetrics(outlet: string) {
  // Simulated data - in a real app, this would fetch from your backend
  const [metrics] = useState<QualityMetrics>({
    callCompliance: 85,
    callsPerDay: 3.2,
    daysInTrade: 42,
  });

  const getRAGStatus = (value: number, metric: keyof QualityMetrics): "red" | "amber" | "green" => {
    switch (metric) {
      case "callCompliance":
        return value >= 80 ? "green" : value >= 60 ? "amber" : "red";
      case "callsPerDay":
        return value >= 3 ? "green" : value >= 2 ? "amber" : "red";
      case "daysInTrade":
        return value >= 40 ? "green" : value >= 30 ? "amber" : "red";
    }
  };

  return {
    metrics,
    getRAGStatus,
  };
}
