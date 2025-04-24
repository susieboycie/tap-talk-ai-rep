
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOutlet } from "@/contexts/outlet-context";

export function OutletSelector() {
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  
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
      return uniqueOutlets.filter(Boolean);
    }
  });

  return (
    <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
      <SelectTrigger className="border-blue-600 bg-blue-700 text-white">
        <SelectValue placeholder="Select an outlet" />
      </SelectTrigger>
      <SelectContent className="border-blue-600 bg-blue-700 text-white">
        {outletNames?.map((outlet) => (
          <SelectItem key={outlet} value={outlet}>
            {outlet}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
