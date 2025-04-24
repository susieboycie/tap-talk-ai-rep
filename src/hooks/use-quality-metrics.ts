
import { useEffect, useState } from 'react';

export interface QualityMetrics {
  callCompliance: number;
  callsPerDay: number;
  daysInTrade: number;
  cpdTarget: number;
  ditTarget: number;
}

export function useQualityMetrics(outlet: string) {
  const [metrics, setMetrics] = useState<QualityMetrics>({
    callCompliance: 0,
    callsPerDay: 0,
    daysInTrade: 0,
    cpdTarget: 7.5,
    ditTarget: 30
  });

  useEffect(() => {
    // Simulated data based on the outlet
    if (outlet === "The Fox") {
      setMetrics({
        callCompliance: 63,
        callsPerDay: 7.3,
        daysInTrade: 26,
        cpdTarget: 7.5,
        ditTarget: 29.3
      });
    } else if (outlet === "The Horse & Hound") {
      setMetrics({
        callCompliance: 59,
        callsPerDay: 6.5,
        daysInTrade: 25,
        cpdTarget: 8.3,
        ditTarget: 34.0
      });
    }
  }, [outlet]);

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

  return {
    metrics,
    getRAGStatus,
  };
}
