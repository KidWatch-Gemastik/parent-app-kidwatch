"use client";

import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";

import { useSupabase } from "@/providers/SupabaseProvider";
import { StatsOverview } from "./components/stats-overview";

export default function StatsPages() {
    const { session } = useSupabase();

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Memuat data, mohon tunggu...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main content */}
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader
                        title="Monitoring Statistik"
                        description="Monitor your children's digital activity and location safety in real-time."
                    />
                    <StatsOverview />
                </main>
            </div>
        </div>
    );
}
