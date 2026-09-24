"use client";

import { useTheme } from "@/components/ThemeProvider";
import Icon from "@/components/Icon";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
        >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
        </button>
    );
}
