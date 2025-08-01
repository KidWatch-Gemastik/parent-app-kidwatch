"use client";

import { useSupabase } from "@/providers/SupabaseProvider";
import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { ChildLocationPage as ChildLocationClient } from "./components/child-location-page";
import { useChildrenLocations } from "@/hooks/useChildrenLocations";

export default function ChildLocationPageWrapper({ userId }: { userId: string }) {
    const { session } = useSupabase();
    const { children, isLoading } = useChildrenLocations(userId);

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Memuat...
            </div>
        );
    }

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
                        initialChildren={children}
                        userId={userId}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </div>
    );
}
