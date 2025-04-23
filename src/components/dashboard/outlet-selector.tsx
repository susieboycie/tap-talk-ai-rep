
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OutletSelectorProps {
  selectedOutlet: string;
  onOutletChange: (value: string) => void;
}

export function OutletSelector({ selectedOutlet, onOutletChange }: OutletSelectorProps) {
  const { data: outletNames } = useQuery({
    queryKey: ['outlet-names'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_sales_volume')
        .select('Outlet')
        .not('Outlet', 'is', null)
        .order('Outlet');
        
      if (error) {
        console.error("Error fetching outlet names:", error);
        throw error;
      }

      const uniqueOutlets = Array.from(new Set(data.map(row => row.Outlet))) as string[];
      console.log("Fetched unique outlets:", uniqueOutlets);
      return uniqueOutlets.filter(Boolean);
    }
  });

  return (
    <Select value={selectedOutlet} onValueChange={onOutletChange}>
      <SelectTrigger className="border-repgpt-600 bg-repgpt-700 text-white">
        <SelectValue placeholder="Select an outlet" />
      </SelectTrigger>
      <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
        {outletNames?.map((outlet) => (
          <SelectItem key={outlet} value={outlet}>
            {outlet}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
