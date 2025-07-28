import { supabase } from "@/lib/supabase"
import { ChildLocationPage } from "./components/child-location-page"
import type { Child } from "@/types"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"

type ChildWithLocation = Child & {
    last_location?: {
        latitude: number
        longitude: number
        timestamp: string
    } | null
}

export default async function Page() {
    const { data: { user } } = await supabase.auth.getUser()

    let initialChildren: ChildWithLocation[] = []

    if (user) {
        const { data: children, error } = await supabase
            .from("children")
            .select("*")
            .eq("parent_id", user.id)

        if (!error && children) {
            const childIds = children.map((child) => child.id)
            const { data: locations } = await supabase
                .from("locations")
                .select("child_id, latitude, longitude, timestamp")
                .in("child_id", childIds)
                .order("timestamp", { ascending: false })

            const latestLocationMap = new Map<string, any>()

            for (const loc of locations || []) {
                if (!latestLocationMap.has(loc.child_id)) {
                    latestLocationMap.set(loc.child_id, loc)
                }
            }

            initialChildren = children.map((child) => ({
                ...child,
                last_location: latestLocationMap.get(child.id) || null,
            }))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader title="Manajemen Lokasi" />
                    <ChildLocationPage initialChildren={initialChildren} />
                </main>
            </div>
        </div>
    );
}
