import { createContext, useContext } from 'react';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  return <DashboardContext.Provider value={{}}>{children}</DashboardContext.Provider>;
}

export const useDashboardContext = () => useContext(DashboardContext);
