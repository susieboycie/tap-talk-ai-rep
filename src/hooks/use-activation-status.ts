
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ActivationStatus = {
  "Activation Name": string | null;
  "Outlet Name": string | null;
  "Ship To": number | null;
  "Activation Status": string | null;
}

export function useActivationStatus(outletName: string | null) {
  const [data, setData] = useState<ActivationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchActivationStatus() {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase.from('activation_status_data').select('*');
        
        if (outletName) {
          query = query.eq('Outlet Name', outletName);
        }
        
        const { data: activationData, error: supabaseError } = await query;

        if (supabaseError) {
          throw supabaseError;
        }

        setData(activationData || []);
      } catch (err) {
        console.error("Error fetching activation status data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast({
          title: "Failed to load activation data",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivationStatus();
  }, [outletName, toast]);

  return { data, isLoading, error };
}
