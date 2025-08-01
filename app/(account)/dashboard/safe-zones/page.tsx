"use client";

import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { SafeZonesPageClient } from "./components/client";

import { useSupabase } from "@/providers/SupabaseProvider";
import { useSafeZones } from "@/hooks/useSafeZones";

export default function SafeZonesPage() {
    const { session } = useSupabase();
    const userId = session?.user.id || null;

    const { safeZones, childrenList, isLoading } = useSafeZones(userId);

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
                        title="Zona Aman"
                        description="Kelola area aman untuk anak-anak Anda"
                    />

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-64 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl rounded-xl"
                                />
                            ))}
                        </div>
                    ) : (
                        <SafeZonesPageClient
                            initialSafeZones={safeZones}
                            childrenList={childrenList}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
