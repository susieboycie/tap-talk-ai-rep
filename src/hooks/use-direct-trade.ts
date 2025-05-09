
import { useQuery } from "@tanstack/react-query";

// This hook now returns empty data since the direct_on_trade table is not available
export function useDirectTrade(outletName: string) {
  return useQuery({
    queryKey: ['direct-trade', outletName],
    queryFn: async () => {
      console.log("Direct trade data requested but table is no longer available");
      return [];  // Return empty array instead of querying non-existent table
    },
    enabled: !!outletName
  });
}
