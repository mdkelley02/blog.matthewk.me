import { useState, useEffect } from "react";
import { StorageKeys, useLocalStorage } from "./useLocalStorage";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const Themes = ["dark", "light"] as const;
export type ThemeColor = (typeof Themes)[number];

const ThemeDataAttr = "data-theme" as const;
const ThemeElementSelector = "html" as const;
const ThemeElement = document.querySelector(ThemeElementSelector);

export const ThemeIcons = {
  dark: <BsFillMoonFill />,
  light: <BsFillSunFill />,
};

export const SkeletonThemeStyles: Record<
  ThemeColor,
  { baseColor: string; highlightColor: string }
> = {
  dark: {
    baseColor: "#202020",
    highlightColor: "#444",
  },
  light: {
    baseColor: "#d9d9d9",
    highlightColor: "#cccccc",
  },
};

export const MarkdownCodeTheme = dracula;

export function useTheme() {
  const [theme, setTheme] = useState<ThemeColor>("light");
  const [savedTheme, setSavedTheme] = useLocalStorage<ThemeColor>(
    StorageKeys.Theme,
    "dark"
  );

  function getSystemTheme(): ThemeColor {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme: ThemeColor) {
    ThemeElement?.setAttribute(ThemeDataAttr, theme);
    setTheme(theme);
    setSavedTheme(theme);
  }

  function toggleTheme() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  useEffect(() => {
    applyTheme(savedTheme || getSystemTheme());
  }, []);

  return [theme, toggleTheme] as const;
}
