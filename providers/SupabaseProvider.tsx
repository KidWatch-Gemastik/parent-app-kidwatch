"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";
import { useState, useEffect, createContext, useContext } from "react";
import type { Database } from "@/types/supabase";

interface SupabaseContextType {
    session: Session | null;
    supabase: ReturnType<typeof createBrowserClient<Database>>;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export default function SupabaseProvider({
    initialSession,
    children,
}: {
    initialSession: Session | null;
    children: React.ReactNode;
}) {
    const [supabase] = useState(() =>
        createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );
    const [session, setSession] = useState<Session | null>(initialSession);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });
        return () => subscription.unsubscribe();
    }, [supabase]);

    return (
        <SupabaseContext.Provider value={{ session, supabase }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export function useSupabase() {
    const context = useContext(SupabaseContext);
    if (!context) throw new Error("useSupabase must be used within SupabaseProvider");
    return context;
}
