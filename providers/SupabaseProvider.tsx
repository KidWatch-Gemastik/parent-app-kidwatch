"use client";

import { supabaseBrowserClient } from "@/lib/supabase/client";
import { createContext, useContext } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const SupabaseContext = createContext<SupabaseClient<Database> | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    return (
        <SupabaseContext.Provider value={supabaseBrowserClient}>
            {children}
        </SupabaseContext.Provider>
    );
}

export function useSupabase() {
    const context = useContext(SupabaseContext);
    if (!context) throw new Error("useSupabase must be used within SupabaseProvider");
    return context;
}
