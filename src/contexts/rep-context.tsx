
import { createContext, useContext, useState, ReactNode } from "react";

interface RepContextType {
  selectedRep: string | null;
  setSelectedRep: (rep: string | null) => void;
}

// Default rep ID for quality page
const DEFAULT_REP_ID = "RE5001";

const RepContext = createContext<RepContextType | undefined>(undefined);

export function RepProvider({ children }: { children: ReactNode }) {
  const [selectedRep, setSelectedRep] = useState<string | null>(DEFAULT_REP_ID);

  return (
    <RepContext.Provider value={{ selectedRep, setSelectedRep }}>
      {children}
    </RepContext.Provider>
  );
}

export function useRep() {
  const context = useContext(RepContext);
  
  if (context === undefined) {
    throw new Error("useRep must be used within a RepProvider");
  }
  
  return context;
}
