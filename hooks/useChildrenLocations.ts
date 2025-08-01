import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { getAgeFromDate } from "@/lib/function";
import type { Child } from "@/types";

export function useChildrenLocations(userId: string | null) {
    const { supabase } = useSupabase();
    const [children, setChildren] = useState<Child[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChildrenWithLocations = async () => {
        if (!userId) return;
        setIsLoading(true);

        const { data: childrenData, error: childrenError } = await supabase
            .from("children")
            .select("id, name, date_of_birth, sex")
            .eq("parent_id", userId);

        if (childrenError) {
            console.error("Error fetching children:", childrenError.message);
            setIsLoading(false);
            return;
        }

        if (childrenData?.length) {
            const childIds = childrenData.map((child) => child.id);

            const { data: locationsData, error: locationError } = await supabase
                .from("locations")
                .select("child_id, latitude, longitude, timestamp, accuracy")
                .in("child_id", childIds)
                .order("timestamp", { ascending: false });

            if (locationError) {
                console.error("Error fetching locations:", locationError.message);
            }

            const latestLocationMap = new Map<
                string,
                { latitude: number; longitude: number; timestamp: string; accuracy: number }
            >();

            locationsData?.forEach((loc) => {
                if (!latestLocationMap.has(loc.child_id)) {
                    latestLocationMap.set(loc.child_id, loc);
                }
            });

            const mappedChildren: Child[] = childrenData.map((child) => {
                const age = getAgeFromDate(child.date_of_birth);
                const latestLoc = latestLocationMap.get(child.id);

                return {
                    id: child.id,
                    name: child.name,
                    age,
                    sex: child.sex || "Unknown",
                    date_of_birth: child.date_of_birth,
                    location: latestLoc
                        ? `${latestLoc.latitude.toFixed(4)}, ${latestLoc.longitude.toFixed(4)}`
                        : "Tidak diketahui",
                    safeZoneStatus: latestLoc ? "Di luar zona aman" : "Tidak diatur",
                    gpsAccuracy: latestLoc ? `${latestLoc.accuracy} meter` : "Tidak diketahui",
                    lastSeen: latestLoc
                        ? new Date(latestLoc.timestamp).toLocaleString()
                        : "Tidak diketahui",
                    status: latestLoc ? "online" : "offline",
                };
            });

            setChildren(mappedChildren);
        } else {
            setChildren([]);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (!userId) return;
        fetchChildrenWithLocations();

        const channel = supabase
            .channel("locations_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "locations" },
                () => fetchChildrenWithLocations()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return { children, isLoading };
}
