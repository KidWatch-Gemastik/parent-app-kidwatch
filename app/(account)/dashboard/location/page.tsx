import { supabase } from "@/lib/supabase"
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { supabaseAuth } from "@/lib/supabase-auth"
import { ChildLocationPage } from "./components/child-location-page"
import type { Child } from "@/types"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"
import { getAgeFromDate } from "@/lib/function"

export default async function Page() {


    const {
        data: { user },
    } = await supabaseAuth.auth.getUser()

    console.log("User ID from Supabase Auth:", user?.id)

    let initialChildren: Child[] = []

    if (user?.id) {
        const parentId = user.id

        const { data: childrenData, error: childrenError } = await supabase
            .from("children")
            .select("id, name, date_of_birth, sex")
            .eq("parent_id", parentId)

        if (childrenError) {
            console.error("Error fetching children:", childrenError.message)
        }

        if (childrenData && childrenData.length > 0) {
            const childIds = childrenData.map((child) => child.id)

            const { data: locationsData, error: locationError } = await supabase
                .from("locations")
                .select("child_id, latitude, longitude, timestamp, accuracy")
                .in("child_id", childIds)
                .order("timestamp", { ascending: false })

            if (locationError) {
                console.error("Error fetching locations:", locationError.message)
            }

            const latestLocationMap = new Map<
                string,
                { latitude: number; longitude: number; timestamp: string; accuracy: number }
            >()

            if (locationsData) {
                for (const loc of locationsData) {
                    if (!latestLocationMap.has(loc.child_id)) {
                        latestLocationMap.set(loc.child_id, loc)
                    }
                }
            }

            initialChildren = childrenData.map((child) => {
                const age = getAgeFromDate(child.date_of_birth)
                const latestLoc = latestLocationMap.get(child.id)

                return {
                    id: child.id,
                    name: child.name,
                    age: age,
                    sex: child.sex || "Unknown",
                    // avatar: child.avatar || `/placeholder.svg?height=40&width=40&text=${child.name[0]}`,
                    date_of_birth: child.date_of_birth,
                    location: latestLoc
                        ? `${latestLoc.latitude.toFixed(4)}, ${latestLoc.longitude.toFixed(4)}`
                        : "Tidak diketahui",
                    safeZoneStatus: latestLoc ? "Di luar zona aman" : "Tidak diatur",
                    gpsAccuracy: latestLoc ? `${latestLoc.accuracy} meter` : "Tidak diketahui",
                    lastSeen: latestLoc ? new Date(latestLoc.timestamp).toLocaleString() : "Tidak diketahui",
                    status: latestLoc ? "online" : "offline",
                }
            })
        }
    }

    console.log("Children loaded:", initialChildren)

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
                    <ChildLocationPage initialChildren={initialChildren} userId={user?.id} />
                </main>
            </div>
        </div>
    )
}
