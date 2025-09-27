"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";

export type Notification = {
    id: string;
    child_id: string;
    package_name: string | null;
    title: string | null;
    body: string | null;
    channel_id: string | null;
    created_at: string;
    is_read: boolean;
};

export function useNotifications(childId?: string) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { supabase } = useSupabase();

    // Initial load
    async function loadInitial() {
        setLoading(true);
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("child_id", childId)
            .order("created_at", { ascending: false })
            .limit(20);

        if (!error && data) {
            setNotifications(data as Notification[]);
        }
        setLoading(false);
    }

    // Realtime subscription
    useEffect(() => {
        if (!childId) return;

        loadInitial();

        const channel = supabase
            .channel(`notifications:${childId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `child_id=eq.${childId}`,
                },
                (payload) => {
                    const newNotif = payload.new as Notification;
                    setNotifications((prev) => [newNotif, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [childId]);

    return { notifications, loading, setNotifications };
}
