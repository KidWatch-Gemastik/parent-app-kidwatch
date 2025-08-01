import { Suspense } from "react"
import { redirect } from "next/navigation"
import { supabaseAuth } from "@/lib/supabase-auth"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"
import { fetchChildrenForSafeZones, fetchSafeZones } from "@/lib/actions/safeZones"
import { SafeZonesPageClient } from "./components/client"

export default async function SafeZonesPage() {
    const {
        data: { session },
    } = await supabaseAuth.auth.getSession()

    if (!session) {
        redirect("/login")
    }

    const initialSafeZones = await fetchSafeZones()
    const childrenList = await fetchChildrenForSafeZones()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-mint-900/20 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-mint-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader title="Zona Aman" description="Kelola area aman untuk anak-anak Anda" />
                    <Suspense
                        fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-64 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl rounded-xl"
                                    />
                                ))}
                            </div>
                        }
                    >
                        <SafeZonesPageClient initialSafeZones={initialSafeZones} childrenList={childrenList} />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}