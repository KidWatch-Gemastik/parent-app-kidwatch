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

    // Load preferences from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("kiddygoo-preferences");
        if (saved) {
            try {
                const parsedPreferences = JSON.parse(saved);
                setPreferences({
                    ...defaultPreferences,
                    ...parsedPreferences,
                    emailNotifications: true,   // override supaya selalu aktif
                    pushNotifications: true,    // override supaya selalu aktif
                    locationTracking: true,     // override supaya selalu aktif
                });
            } catch (error) {
                console.error("Failed to parse saved preferences:", error);
            }
        }
    }, []);

    // Apply theme changes to document
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

    const updatePreference = <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => {
        // override agar emailNotifications, pushNotifications, & locationTracking selalu true
        if (key === "emailNotifications" || key === "pushNotifications" || key === "locationTracking") return;

        setPreferences((prev) => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const savePreferences = () => {
        // pastikan email, push, locationTracking selalu aktif
        const savedPreferences = {
            ...preferences,
            emailNotifications: true,
            pushNotifications: true,
            locationTracking: true,
        };
        localStorage.setItem("kiddygoo-preferences", JSON.stringify(savedPreferences));
        setPreferences(savedPreferences);
        setHasChanges(false);

        // Show success notification
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
        setPreferences(defaultPreferences);
        localStorage.removeItem("kiddygoo-preferences");
        setHasChanges(false);
    };

    // Request notification permission saat pushNotifications aktif
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
