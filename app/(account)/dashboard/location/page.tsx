"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Child } from "@/types";
import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { ChildLocationPage as ChildLocationClient } from "./components/child-location-page";
import { getAgeFromDate } from "@/lib/function";

export default function ChildLocationPageWrapper({ userId }: { userId: string }) {
    const { supabase } = useSupabase();
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChildrenWithLocations = async () => {
        setLoading(true);

        const { data: childrenData, error: childrenError } = await supabase
            .from("children")
            .select("id, name, date_of_birth, sex")
            .eq("parent_id", userId);

        if (childrenError) {
            console.error("Error fetching children:", childrenError.message);
            setLoading(false);
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

        setLoading(false);
    };

    useEffect(() => {
        if (userId) {
            fetchChildrenWithLocations();

            // Optional: subscribe ke perubahan lokasi anak
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
        }
    }, [userId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader
                        title="Manajemen Lokasi"
                        description="Pantau lokasi anak-anak Anda secara real-time"
                    />
                    <ChildLocationClient initialChildren={children} userId={userId} />
                </main>
            </div>
        </div>
    );
}
