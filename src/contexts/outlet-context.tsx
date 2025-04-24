
import React, { createContext, useContext, useState } from 'react';

interface OutletContextType {
  selectedOutlet: string;
  setSelectedOutlet: (outlet: string) => void;
}

const OutletContext = createContext<OutletContextType | undefined>(undefined);

export function OutletProvider({ children }: { children: React.ReactNode }) {
  const [selectedOutlet, setSelectedOutlet] = useState("");

  return (
    <OutletContext.Provider value={{ selectedOutlet, setSelectedOutlet }}>
      {children}
    </OutletContext.Provider>
  );
}

export function useOutlet() {
  const context = useContext(OutletContext);
  if (context === undefined) {
    throw new Error('useOutlet must be used within an OutletProvider');
  }
  return context;
}
