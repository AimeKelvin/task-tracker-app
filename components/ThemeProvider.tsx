"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const STORAGE_KEY = "taskly-theme";
const CHANGE_EVENT = "taskly-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getTheme(): Theme {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") return saved;
    } catch {
        // Storage can be unavailable in private browsing; follow the OS setting instead.
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    media.addEventListener("change", onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(CHANGE_EVENT, onChange);
        media.removeEventListener("change", onChange);
    };
}

function getServerTheme(): Theme {
    return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
            "content",
            theme === "dark" ? "#0b0b0d" : "#f7f7f5",
        );
    }, [theme]);

    const value = useMemo<ThemeContextValue>(() => ({
        theme,
        toggleTheme() {
            const next = theme === "dark" ? "light" : "dark";
            try {
                window.localStorage.setItem(STORAGE_KEY, next);
            } catch {
                // The in-memory event still updates this tab if storage is unavailable.
            }
            window.dispatchEvent(new Event(CHANGE_EVENT));
        },
    }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside ThemeProvider.");
    return context;
}
