
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const personas = [
  { id: "entrepreneur", name: "The Entrepreneur" },
  { id: "deal-maker", name: "The Deal Maker" },
  { id: "pragmatist", name: "The Pragmatist" },
  { id: "support-seeker", name: "The Support Seeker" }
] as const;

interface PersonaSelectorProps {
  selectedPersona: string;
  onPersonaChange: (value: string) => void;
}

export function PersonaSelector({ selectedPersona, onPersonaChange }: PersonaSelectorProps) {
  return (
    <Select value={selectedPersona} onValueChange={onPersonaChange}>
      <SelectTrigger className="border-repgpt-600 bg-repgpt-700 text-white">
        <SelectValue placeholder="Select Persona" />
      </SelectTrigger>
      <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
        {personas.map((persona) => (
          <SelectItem key={persona.id} value={persona.name}>
            {persona.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
