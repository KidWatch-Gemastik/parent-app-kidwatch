"use client";

import { useState, useEffect } from "react";

export interface PreferencesState {
    darkMode: boolean;
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    locationTracking: boolean;
    autoLock: boolean;
    soundEnabled: boolean;
    dataSync: boolean;
    offlineMode: boolean;
    language: string;
    theme: "light" | "dark" | "system";
    soundVolume: number[];
    autoLockTime: number[];
}

const defaultPreferences: PreferencesState = {
    darkMode: true,
    notifications: true,
    emailNotifications: true, // wajib true
    pushNotifications: true,  // wajib true
    locationTracking: true,   // wajib true
    autoLock: true,
    soundEnabled: true,
    dataSync: true,
    offlineMode: false,
    language: "id",
    theme: "dark",
    soundVolume: [75],
    autoLockTime: [5],
};

export function usePreferences() {
    const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);
    const [hasChanges, setHasChanges] = useState(false);

    // Load or initialize preferences
    useEffect(() => {
        const saved = localStorage.getItem("kiddygoo-preferences");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPreferences({
                    ...defaultPreferences,
                    ...parsed,
                    emailNotifications: true,
                    pushNotifications: true,
                    locationTracking: true,
                });
            } catch (error) {
                console.error("Failed to parse saved preferences:", error);
                localStorage.setItem("kiddygoo-preferences", JSON.stringify(defaultPreferences));
            }
        } else {
            // jika belum ada di localStorage, auto push default data
            localStorage.setItem("kiddygoo-preferences", JSON.stringify(defaultPreferences));
            setPreferences(defaultPreferences);
        }
    }, []);

    // Apply theme changes dynamically
    useEffect(() => {
        const root = document.documentElement;

        if (preferences.theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const applySystemTheme = () => {
                root.classList.toggle("dark", mediaQuery.matches);
            };
            applySystemTheme();
            mediaQuery.addEventListener("change", applySystemTheme);
            return () => mediaQuery.removeEventListener("change", applySystemTheme);
        } else {
            root.classList.toggle("dark", preferences.theme === "dark" || preferences.darkMode);
        }
    }, [preferences.theme, preferences.darkMode]);

    const updatePreference = <K extends keyof PreferencesState>(
        key: K,
        value: PreferencesState[K]
    ) => {
        if (key === "emailNotifications" || key === "pushNotifications" || key === "locationTracking") return;
        setPreferences((prev) => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const savePreferences = () => {
        const savedPreferences = {
            ...preferences,
            emailNotifications: true,
            pushNotifications: true,
            locationTracking: true,
        };
        localStorage.setItem("kiddygoo-preferences", JSON.stringify(savedPreferences));
        setPreferences(savedPreferences);
        setHasChanges(false);

        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted" && preferences.pushNotifications) {
                new Notification("Preferences Saved", {
                    body: "Your preferences have been saved successfully!",
                    icon: "/kiddygoo/KiddyGoo_Icon_Logo.png?height=64&width=64&text=✓",
                });
            }
        }
    };

    const resetPreferences = () => {
        localStorage.setItem("kiddygoo-preferences", JSON.stringify(defaultPreferences));
        setPreferences(defaultPreferences);
        setHasChanges(false);
    };

    // Request notification permission once on mount
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
        }
    }, []);

    return {
        preferences,
        updatePreference,
        savePreferences,
        resetPreferences,
        hasChanges,
    };
}
