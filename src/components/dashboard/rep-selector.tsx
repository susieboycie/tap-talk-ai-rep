
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRep } from "@/contexts/rep-context";

interface RepSelectorProps {
  selectedRep?: string;
  onRepChange?: (rep: string) => void;
}

export function RepSelector({ selectedRep: propSelectedRep, onRepChange }: RepSelectorProps = {}) {
  const { selectedRep: contextSelectedRep, setSelectedRep } = useRep();
  
  // Use either the prop value or the context value
  const selectedRep = propSelectedRep !== undefined ? propSelectedRep : contextSelectedRep;
  
  // Handle change using either the provided handler or the context setter
  const handleRepChange = (value: string) => {
    if (onRepChange) {
      onRepChange(value);
    } else {
      setSelectedRep(value);
    }
  };
  
  const { data: repIds } = useQuery({
    queryKey: ['rep-ids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('target_tiering_data')
        .select('distinct "Rep ID"')
        .not('"Rep ID"', 'is', null)
        .order('"Rep ID"');
        
      if (error) {
        console.error("Error fetching Rep IDs:", error);
        throw error;
      }

      const uniqueReps = Array.from(new Set(data.map(row => row['Rep ID']))) as string[];
      return uniqueReps.filter(Boolean);
    }
  });

  return (
    <Select value={selectedRep || undefined} onValueChange={handleRepChange}>
      <SelectTrigger className="border-orange-600 bg-orange-700 text-white">
        <SelectValue placeholder="Select a rep" />
      </SelectTrigger>
      <SelectContent className="border-orange-600 bg-orange-700 text-white">
        {repIds?.map((rep) => (
          <SelectItem key={rep} value={rep}>
            {rep}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
