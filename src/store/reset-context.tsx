"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ResetContextType {
  shouldReset: boolean;
  triggerReset: () => void;
}

const ResetContext = createContext<ResetContextType>({
  shouldReset: false,
  triggerReset: () => {},
});

export const useReset = () => useContext(ResetContext);

interface ResetProviderProps {
  children: ReactNode;
}

export const ResetProvider: React.FC<ResetProviderProps> = ({ children }) => {
  const [shouldReset, setShouldReset] = useState(false);

  const triggerReset = () => {
    setShouldReset(true);
    // Optionally, set a timeout to turn it back off after all components have reset
    setTimeout(() => setShouldReset(false), 1);
  };

  return (
    <ResetContext.Provider value={{ shouldReset, triggerReset }}>
      {children}
    </ResetContext.Provider>
  );
};
