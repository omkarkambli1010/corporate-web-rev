
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

type AccessibilityContextValue = {
  theme: ThemeMode;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleTheme: () => void;
  setLightTheme: () => void;
  setDarkTheme: () => void;
};

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 22;

export const STORAGE_KEYS = {
  theme: "sbisecurities-theme",
  fontSize: "sbisecurities-font-size",
};

const AccessibilityContext =
  createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
      const savedFontSize = window.localStorage.getItem(STORAGE_KEYS.fontSize);

      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }

      if (savedFontSize) {
        const parsedFontSize = Number(savedFontSize);

        if (
          Number.isFinite(parsedFontSize) &&
          parsedFontSize >= MIN_FONT_SIZE &&
          parsedFontSize <= MAX_FONT_SIZE
        ) {
          setFontSize(parsedFontSize);
        }
      }

      setPreferencesLoaded(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  /* The inline script in app/layout.tsx has already applied the saved theme
     and font size before first paint, so nothing is written to <html> until
     the saved preferences are loaded here; writing the "light" default first
     would flash the page back to light. */
  useEffect(() => {
    if (!preferencesLoaded) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    // Bootstrap 5.3's own dark mode, for any Bootstrap-styled controls.
    root.setAttribute("data-bs-theme", theme);
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    document.documentElement.style.setProperty(
      "--font-size-base",
      `${fontSize}px`
    );
    window.localStorage.setItem(STORAGE_KEYS.fontSize, String(fontSize));
  }, [fontSize, preferencesLoaded]);

  const increaseFontSize = useCallback(() => {
    setFontSize((currentFontSize) =>
      Math.min(currentFontSize + 2, MAX_FONT_SIZE)
    );
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((currentFontSize) =>
      Math.max(currentFontSize - 2, MIN_FONT_SIZE)
    );
  }, []);

  const resetFontSize = useCallback(() => {
    setFontSize(DEFAULT_FONT_SIZE);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme("light");
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme("dark");
  }, []);

  const value = useMemo(
    () => ({
      theme,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      toggleTheme,
      setLightTheme,
      setDarkTheme,
    }),
    [
      theme,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      toggleTheme,
      setLightTheme,
      setDarkTheme,
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility must be used inside AccessibilityProvider"
    );
  }

  return context;
}
