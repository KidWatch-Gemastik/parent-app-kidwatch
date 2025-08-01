import { useSupabase } from "@/providers/SupabaseProvider";
import { useEffect, useState } from "react";
import type { SafeZone, Child } from "@/types";

export function useSafeZones(userId: string | null) {
    const { supabase } = useSupabase();
    const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId || !supabase) return;

        const fetchData = async () => {
            setIsLoading(true);

            const { data: childrenData } = await supabase
                .from("children")
                .select("id, name, date_of_birth, sex")
                .eq("parent_id", userId);

            const { data: safeZonesData } = await supabase
                .from("safe_zones")
                .select("id, name, latitude, longitude, radius, child_id, created_at")
                .eq("parent_id", userId);

            setChildrenList(childrenData || []);
            setSafeZones(safeZonesData || []);
            setIsLoading(false);
        };

        fetchData();
    }, [userId, supabase]);

    return { safeZones, childrenList, isLoading };
}
