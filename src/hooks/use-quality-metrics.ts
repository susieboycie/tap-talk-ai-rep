
import { useEffect, useState } from 'react';

export interface QualityMetrics {
  callCompliance: number;
  callsPerDay: number;
  daysInTrade: number;
  cpdTarget: number;
  ditTarget: number;
  // New KPIs
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

export function useQualityMetrics(outlet: string) {
  const [metrics, setMetrics] = useState<QualityMetrics>({
    callCompliance: 0,
    callsPerDay: 0,
    daysInTrade: 0,
    cpdTarget: 7.5,
    ditTarget: 30,
    guinness: { target: 423, actual: 373 },
    rockshoreDistribution: { target: 546, actual: 509 },
    rockshoreActivations: 199,
    smirnoffIce: { target: 115, actual: 4 },
    casamigos: { target: 82, actual: 26 }
  });

  useEffect(() => {
    if (outlet === "The Fox") {
      setMetrics({
        callCompliance: 63,
        callsPerDay: 7.3,
        daysInTrade: 26,
        cpdTarget: 7.5,
        ditTarget: 29.3,
        guinness: { target: 423, actual: 373 },
        rockshoreDistribution: { target: 546, actual: 509 },
        rockshoreActivations: 199,
        smirnoffIce: { target: 115, actual: 4 },
        casamigos: { target: 82, actual: 26 }
      });
    } else if (outlet === "The Horse & Hound") {
      setMetrics({
        callCompliance: 59,
        callsPerDay: 6.5,
        daysInTrade: 25,
        cpdTarget: 8.3,
        ditTarget: 34.0,
        guinness: { target: 437, actual: 405 },
        rockshoreDistribution: { target: 642, actual: 522 },
        rockshoreActivations: 139,
        smirnoffIce: { target: 129, actual: 43 },
        casamigos: { target: 71, actual: 41 }
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

  const getProductRAGStatus = (actual: number, target: number): "red" | "amber" | "green" => {
    const percentage = (actual / target) * 100;
    return percentage >= 90 ? "green" : percentage >= 70 ? "amber" : "red";
  };

  return {
    metrics,
    getRAGStatus,
    getProductRAGStatus,
  };
}
