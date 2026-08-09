"use client";

import { createContext, useContext, ReactNode } from "react";

// Portfolio is light-only — theme is always light
const ThemeContext = createContext({ theme: "light" as const });

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
