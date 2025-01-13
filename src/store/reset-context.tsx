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
    // Provide a longer timeout to give components enough time to reset
    setTimeout(() => setShouldReset(false), 100); // 100ms should be enough
  };

  return (
    <ResetContext.Provider value={{ shouldReset, triggerReset }}>
      {children}
    </ResetContext.Provider>
  );
};
