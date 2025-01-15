import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { theme, ThemeConfig } from "antd";

const lightTheme: ThemeConfig = {
  token: {
    wireframe: true,
  },
  algorithm: theme.defaultAlgorithm,
};

const darkTheme: ThemeConfig = {
  token: {
    wireframe: true,
  },
  algorithm: theme.darkAlgorithm,
};

export const ThemeType = {
  lightTheme,
  darkTheme,
};

interface ThemeState {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: lightTheme,
      setTheme: (theme) => set({ theme }),
      initializeTheme: () => {
        if (typeof window !== "undefined") {
          const prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          set({ theme: prefersDarkScheme ? darkTheme : lightTheme });
          // set({ theme:  lightTheme });
        }
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Return a dummy storage implementation for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
