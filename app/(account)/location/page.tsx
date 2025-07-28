import { supabase } from "@/lib/supabase"
import { ChildLocationPage } from "./components/child-location-page"
import type { Child } from "@/types"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"

export default async function Page() {
    const { data: { user } } = await supabase.auth.getUser()

    let initialChildren: Child[] = []

    if (user) {
        const { data, error } = await supabase
            .from("children")
            .select("*")
            .eq("parent_id", user.id)

        if (!error && data) {
            initialChildren = data
        }
    }

    return (
        <>
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
        </>
    );
}
