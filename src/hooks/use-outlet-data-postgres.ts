
import { postgres } from "@/integrations/postgres/client";
import { useQuery } from "@tanstack/react-query";
import type { OutletData } from "./use-outlet-data";

/**
 * Hook to fetch outlet data from PostgreSQL database
 * @param outletName The name of the outlet to fetch data for
 * @returns Query result containing outlet data or null
 */
export function useOutletDataPostgres(outletName: string | null) {
  return useQuery({
    queryKey: ['outlet-data-postgres', outletName],
    queryFn: async () => {
      if (!outletName) return null;
      
      const { data, error } = await postgres
        .from('outlet_data')
        .select('*')
        .eq('Outlet Name', outletName)
        .maybeSingle();

      if (error) {
        console.error("Error fetching outlet data from Postgres:", error);
        throw error;
      }
      
      return data as OutletData | null;
    },
    enabled: !!outletName,
  });
}
