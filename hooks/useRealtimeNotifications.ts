"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getDeviceToken } from "@/lib/firebase";
import { toast } from "sonner";

export interface Notification {
    id: string;
    child_id: string;
    title: string | null;
    body: string | null;
    package_name?: string | null;
    is_read: boolean;
    ai_analysis?: {
        text: string;
        predicted_label: string;
        score: number;
        all_scores: any[];
    };
}

const LOCAL_STORAGE_KEY = "parent_notifications";
const PREFERENCES_KEY = "kiddygoo-preferences";

export function useRealtimeNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [childIds, setChildIds] = useState<string[]>([]);
    const [deviceToken, setDeviceToken] = useState<string | undefined>(undefined);
    const [parentEmail, setParentEmail] = useState<string | undefined>(undefined);
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    // -----------------------------
    // Ambil parent preferences dari localStorage
    // -----------------------------
    useEffect(() => {
        const prefsStr = localStorage.getItem(PREFERENCES_KEY);
        if (!prefsStr) return;
        try {
            const prefs = JSON.parse(prefsStr);
            if (prefs.parentEmail) setParentEmail(prefs.parentEmail);
            if (prefs.emailNotifications) setEmailNotificationsEnabled(true);
        } catch (err) {
            console.error("Gagal parse kiddygoo-preferences:", err);
        }
    }, []);

    // -----------------------------
    // Minta izin notifikasi otomatis saat pertama kali mount
    // -----------------------------
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // -----------------------------
    // Ambil device token Firebase
    // -----------------------------
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await getDeviceToken();
                setDeviceToken(token!);
            } catch (err) {
                console.error("Gagal ambil device token:", err);
            }
        };
        fetchToken();
    }, []);

    // -----------------------------
    // Ambil daftar child ID
    // -----------------------------
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user?.id) return;

                const { data, error } = await supabase
                    .from("children")
                    .select("id")
                    .eq("parent_id", user.id);

                if (error) throw error;

                setChildIds(data?.map((c) => c.id) || []);
            } catch (err) {
                console.error("Gagal fetch children:", err);
            }
        };
        fetchChildren();
    }, []);

    // -----------------------------
    // Load notifikasi dari localStorage
    // -----------------------------
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) setNotifications(JSON.parse(saved));
    }, []);

    // -----------------------------
    // Simpan notifikasi ke localStorage tiap update
    // -----------------------------
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    // -----------------------------
    // Fungsi push notification browser
    // -----------------------------
    const showBrowserNotification = (title: string, body: string) => {
        if (!("Notification" in window) || Notification.permission !== "granted") return;
        new Notification(title, { body, icon: "/kiddygoo/KiddyGoo_Icon_Logo.png", silent: false });
    };

    // -----------------------------
    // Proses notifikasi: kirim ke AI, email (jika aktif), push, update DB + state
    // -----------------------------
    const processNotification = async (notif: Notification) => {
        if (notif.is_read) return;

        try {
            // Kirim ke AI backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze-text/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: notif.body,
                    parent_token: deviceToken,
                    parent_email: parentEmail,
                }),
            });

            if (!res.ok) throw new Error(`Failed send notification: ${res.status}`);
            const aiData = await res.json();
            notif.ai_analysis = aiData;

            // Kirim ke email parent jika diaktifkan
            if (emailNotificationsEnabled && parentEmail) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-email/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        to: parentEmail,
                        subject: notif.title || "KiddyGoo Notification",
                        message: notif.body,
                    }),
                });
            }

            // Push browser notification
            showBrowserNotification(notif.title || "Notifikasi baru", notif.body || "");

            // Update Supabase: tandai is_read = true
            const { error } = await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", notif.id);
            if (error) throw error;

            notif.is_read = true;

            // Update state lokal tanpa duplikasi
            setNotifications((prev) => {
                const map = new Map(prev.map((n) => [n.id, n]));
                map.set(notif.id, notif);
                return Array.from(map.values());
            });

        } catch (err) {
            console.error("Gagal proses notifikasi:", err);
            toast.error("Gagal kirim notifikasi ke backend/email");
        }
    };

    // -----------------------------
    // Fetch unread notifikasi saat mount
    // -----------------------------
    useEffect(() => {
        if (!childIds.length || !deviceToken) return;

        const fetchUnread = async () => {
            try {
                const { data, error } = await supabase
                    .from("notifications")
                    .select("*")
                    .in("child_id", childIds)
                    .eq("is_read", false);

                if (error) throw error;

                data?.forEach(processNotification);
            } catch (err) {
                console.error("Gagal fetch unread notifications:", err);
            }
        };

        fetchUnread();
    }, [childIds, deviceToken, parentEmail, emailNotificationsEnabled]);

    // -----------------------------
    // Realtime subscription untuk unread
    // -----------------------------
    useEffect(() => {
        if (!childIds.length || !deviceToken) return;

        const subs = childIds.map((childId) =>
            supabase
                .channel(`notifications-${childId}`)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "notifications", filter: `child_id=eq.${childId}` },
                    async (payload) => {
                        const notif = payload.new as Notification;
                        if (!notif.id || notif.is_read) return;
                        processNotification(notif);
                    }
                )
                .subscribe()
        );

        setLoading(false);

        return () => subs.forEach((sub) => supabase.removeChannel(sub));
    }, [childIds, deviceToken, parentEmail, emailNotificationsEnabled]);

    return { notifications, loading };
}
