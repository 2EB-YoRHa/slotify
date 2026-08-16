import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "slotify-theme";

type ThemeMode = "light" | "dark";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => currentTheme());

  useEffect(() => {
    setTheme(currentTheme());

    function handleStorageChange(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) return;

      setTheme(currentTheme());
    }

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function toggleTheme() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  const darkModeEnabled = theme === "dark";
  const Icon = darkModeEnabled ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={darkModeEnabled ? "Switch to light mode" : "Switch to dark mode"}
      title={darkModeEnabled ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <Icon
        size={17}
        strokeWidth={2.4}
        className={darkModeEnabled ? "text-amber-300" : "text-slate-500"}
      />
    </button>
  );
}

function currentTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  const darkModeEnabled = theme === "dark";

  document.documentElement.classList.toggle("dark", darkModeEnabled);
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}