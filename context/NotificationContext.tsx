"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";

export interface Notification {
    id: string;
    child_id: string;
    title: string;
    body: string;
    channel_id: string | null;
    created_at: string;
    is_read: boolean;
}

interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    page: number;
    hasMore: boolean;
}

type Action =
    | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
    | { type: "ADD_NOTIFICATION"; payload: Notification }
    | { type: "INCREMENT_PAGE" }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_HAS_MORE"; payload: boolean }
    | { type: "MARK_AS_READ"; payload: string }
    | { type: "SORT_NOTIFICATIONS" };

const NotificationContext = createContext<{
    state: NotificationState;
    dispatch: React.Dispatch<Action>;
    fetchNextPage: () => void;
    markAsRead: (id: string) => void;
} | null>(null);

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    page: 1,
    hasMore: true,
};

function reducer(state: NotificationState, action: Action): NotificationState {
    switch (action.type) {
        case "SET_NOTIFICATIONS":
            return { ...state, notifications: action.payload };
        case "ADD_NOTIFICATION":
            return { ...state, notifications: [action.payload, ...state.notifications] };
        case "INCREMENT_PAGE":
            return { ...state, page: state.page + 1 };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_HAS_MORE":
            return { ...state, hasMore: action.payload };
        case "MARK_AS_READ":
            return {
                ...state,
                notifications: state.notifications.map((n) =>
                    n.id === action.payload ? { ...n, is_read: true } : n
                ),
            };
        case "SORT_NOTIFICATIONS":
            return {
                ...state,
                notifications: [...state.notifications].sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                ),
            };
        default:
            return state;
    }
}

interface NotificationProviderProps {
    children: ReactNode;
    parentId: string;
}

export const NotificationProvider = ({ children, parentId }: NotificationProviderProps) => {
    const { supabase } = useSupabase();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [childIds, setChildIds] = useState<string[]>([]);
    const limit = 10;

    // Ambil semua child dari parent_id
    useEffect(() => {
        if (!supabase || !parentId) return;
        const fetchChildren = async () => {
            const { data, error } = await supabase
                .from("children")
                .select("id")
                .eq("parent_id", parentId);

            console.log("fetchChildren data:", data, "error:", error);

            if (!error && data) {
                const ids = data.map((c: any) => c.id);
                console.log("childIds set:", ids);
                setChildIds(ids);
            }
        };
        fetchChildren();
    }, [supabase, parentId]);

    // Fetch notifikasi dengan paging
    const fetchNextPage = async () => {
        if (!supabase || childIds.length === 0) return;
        dispatch({ type: "SET_LOADING", payload: true });

        const from = (state.page - 1) * limit;
        const to = from + limit - 1;

        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .in("child_id", childIds)
            .order("created_at", { ascending: false })
            .range(from, to);

        console.log("fetchNextPage data (notifications):", data, "error:", error);

        if (!error) {
            dispatch({ type: "SET_NOTIFICATIONS", payload: [...state.notifications, ...(data || [])] });
            dispatch({ type: "INCREMENT_PAGE" });
            if (!data || data.length < limit) dispatch({ type: "SET_HAS_MORE", payload: false });
            dispatch({ type: "SORT_NOTIFICATIONS" });
        } else console.error(error);

        dispatch({ type: "SET_LOADING", payload: false });
    };


    // Ambil notifikasi otomatis setelah childIds siap
    useEffect(() => {
        if (childIds.length > 0) {
            console.log("Fetching initial notifications for childIds:", childIds);
            fetchNextPage();
        }
    }, [childIds]);

    // Mark as read
    const markAsRead = async (id: string) => {
        if (!supabase) return;

        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id);

        console.log("markAsRead result id:", id, "error:", error);

        if (!error) dispatch({ type: "MARK_AS_READ", payload: id });
    };

    // Realtime subscription
    useEffect(() => {
        if (!supabase || childIds.length === 0) return;

        console.log("Setting up realtime subscription for childIds:", childIds);

        const subscription = supabase
            .channel("public:notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `child_id=in.(${childIds.map(id => `"${id}"`).join(",")})`,
                },
                (payload) => {
                    console.log("Realtime new notification received:", payload.new);
                    const newNotification = payload.new as Notification;
                    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
                    dispatch({ type: "SORT_NOTIFICATIONS" });
                }
            )
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, [supabase, childIds]);

    // **Console log semua notifications setiap update**
    useEffect(() => {
        console.log("All notifications state updated:", state.notifications);
    }, [state.notifications]);

    return (
        <NotificationContext.Provider value={{ state, dispatch, fetchNextPage, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within NotificationProvider");
    return context;
};
