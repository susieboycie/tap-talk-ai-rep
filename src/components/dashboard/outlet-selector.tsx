
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOutlet } from "@/contexts/outlet-context";

interface OutletSelectorProps {
  selectedOutlet?: string;
  onOutletChange?: (outlet: string) => void;
}

export function OutletSelector({ selectedOutlet: propSelectedOutlet, onOutletChange }: OutletSelectorProps = {}) {
  const { selectedOutlet: contextSelectedOutlet, setSelectedOutlet } = useOutlet();
  
  // Use either the prop value or the context value
  const selectedOutlet = propSelectedOutlet !== undefined ? propSelectedOutlet : contextSelectedOutlet;
  
  // Handle change using either the provided handler or the context setter
  const handleOutletChange = (value: string) => {
    if (onOutletChange) {
      onOutletChange(value);
    } else {
      setSelectedOutlet(value);
    }
  };
  
  const { data: outletNames } = useQuery({
    queryKey: ['outlet-names'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outlet_data')
        .select('Outlet Name')
        .not('Outlet Name', 'is', null)
        .order('Outlet Name');
        
      if (error) {
        console.error("Error fetching outlet names:", error);
        throw error;
      }

      const uniqueOutlets = Array.from(new Set(data.map(row => row['Outlet Name']))) as string[];
      return uniqueOutlets.filter(Boolean);
    }
  });

  return (
    <Select value={selectedOutlet} onValueChange={handleOutletChange}>
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
