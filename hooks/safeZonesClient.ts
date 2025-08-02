import type { SafeZone } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchSafeZonesClient(
    supabase: SupabaseClient,
    userId: string
): Promise<SafeZone[]> {
    const { data: children, error: childError } = await supabase
        .from("children")
        .select("id")
        .eq("parent_id", userId);

    if (childError) {
        console.error("Error fetching children:", childError.message);
        return [];
    }

    if (!children || children.length === 0) {
        return [];
    }

    const childIds = children.map((c) => c.id);

    const { data: zones, error } = await supabase
        .from("safe_zones")
        .select("*")
        .in("child_id", childIds);

    if (error) {
        console.error("Error fetching safe zones:", error.message);
        return [];
    }

    return zones || [];
}
