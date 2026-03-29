"use client";

import { createContext, useContext, ReactNode } from "react";

// Portfolio is dark-only — theme is always dark
const ThemeContext = createContext({ theme: "dark" as const });

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
