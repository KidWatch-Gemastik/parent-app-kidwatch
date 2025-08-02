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

            const { data: childrenData, error: childError } = await supabase
                .from("children")
                .select("id, name, date_of_birth, sex")
                .eq("parent_id", userId);

            if (childError) {
                console.error("Error fetching children:", childError.message);
                setIsLoading(false);
                return;
            }

            setChildrenList(childrenData || []);

            if (!childrenData || childrenData.length === 0) {
                setSafeZones([]);
                setIsLoading(false);
                return;
            }

            const childIds = childrenData.map((c) => c.id);

            const { data: safeZonesData, error: zoneError } = await supabase
                .from("safe_zones")
                .select("id, name, latitude, longitude, radius, child_id, created_at")
                .in("child_id", childIds);

            if (zoneError) {
                console.error("Error fetching safe zones:", zoneError.message);
                setIsLoading(false);
                return;
            }

            setSafeZones(safeZonesData || []);
            setIsLoading(false);
        };

        fetchData();
    }, [userId, supabase]);

    return { safeZones, childrenList, isLoading };
}
