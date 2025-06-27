"use client";

import { createContext, useContext } from 'react';

const ManagerContext = createContext();

export const useManager = () => {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error('useManager must be used within a ManagerProvider');
  }
  return context;
};

export const ManagerProvider = ({ children, value }) => {
  return (
    <ManagerContext.Provider value={value}>
      {children}
    </ManagerContext.Provider>
  );
};