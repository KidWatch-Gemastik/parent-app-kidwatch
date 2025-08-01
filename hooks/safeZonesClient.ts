"use client";

import { useSupabase } from "@/providers/SupabaseProvider";
import type { SafeZone } from "@/types";

export async function fetchSafeZonesClient(supabase: ReturnType<typeof useSupabase>["supabase"], userId: string) {
    const { data: zones, error } = await supabase
        .from("safe_zones")
        .select("*")
        .eq("parent_id", userId);

    if (error) {
        console.error("Error fetching safe zones:", error);
        return [];
    }

    return zones as SafeZone[];
}
