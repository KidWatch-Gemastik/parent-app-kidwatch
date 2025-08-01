"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { ChildLocationPage as ChildLocationClient } from "./components/child-location-page";
import { useChildrenLocations } from "@/hooks/useChildrenLocations";
import type { Child } from "@/types";
import { supabaseBrowserClient } from "@/lib/supabase/client"; // ✅ Import instance

export default function ChildLocationPageWrapper() {
    const { session } = useSupabase();
    const userId = session?.user.id || null;

    const { children, isLoading } = useChildrenLocations(userId);
    const [initialChildren, setInitialChildren] = useState<Child[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!userId) return;

            // ✅ gunakan supabaseBrowserClient langsung
            const { data: childrenData } = await supabaseBrowserClient
                .from("children")
                .select("id, name, date_of_birth, sex")
                .eq("parent_id", userId);

            if (!childrenData?.length) return;

            const childIds = childrenData.map((c) => c.id);

            const { data: locationsData } = await supabaseBrowserClient
                .from("locations")
                .select("child_id, latitude, longitude, timestamp, accuracy")
                .in("child_id", childIds)
                .order("timestamp", { ascending: false });

            // ✅ Typing Child agar tidak any
            const mappedChildren: Child[] = childrenData.map((child: any) => {
                const latestLoc = locationsData?.find((loc) => loc.child_id === child.id);
                return {
                    ...child,
                    location: latestLoc
                        ? `${latestLoc.latitude.toFixed(4)}, ${latestLoc.longitude.toFixed(4)}`
                        : "Tidak diketahui",
                    status: latestLoc ? "online" : "offline",
                } as Child;
            });

            setInitialChildren(mappedChildren);
        };

        fetchInitialData();
    }, [userId]);

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Memuat...
            </div>
        );
    }

    const displayChildren = children.length > 0 ? children : initialChildren;

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
                    <ChildLocationClient
                        initialChildren={displayChildren}
                        userId={userId!}
                        isLoading={isLoading && displayChildren.length === 0}
                    />
                </main>
            </div>
        </div>
    );
}
