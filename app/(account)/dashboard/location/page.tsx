import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { ChildLocationPage as ChildLocationClient } from "./components/child-location-page";
import type { Child } from "@/types";

export default async function ChildLocationPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const {
        data: {
            session,
        },
    } = await supabase.auth.getSession();

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Memuat...
            </div>
        );
    }

    // --- SSR Fetch Children ---
    const { data: childrenData } = await supabase
        .from("children")
        .select("id, name, date_of_birth, sex")
        .eq("parent_id", session.user.id);

    let mappedChildren: Child[] = [];

    if (childrenData?.length) {
        const childIds = childrenData.map((c) => c.id);

        const { data: locationsData } = await supabase
            .from("locations")
            .select("child_id, latitude, longitude, timestamp, accuracy")
            .in("child_id", childIds)
            .order("timestamp", { ascending: false });

        mappedChildren = childrenData.map((child: any) => {
            const latestLoc = locationsData?.find((loc) => loc.child_id === child.id);
            return {
                ...child,
                location: latestLoc
                    ? `${latestLoc.latitude.toFixed(4)}, ${latestLoc.longitude.toFixed(4)}`
                    : "Tidak diketahui",
                status: latestLoc ? "online" : "offline",
            } as Child;
        });
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
                        initialChildren={mappedChildren}
                        userId={session.user.id}
                        isLoading={false}
                    />
                </main>
            </div>
        </div>
    );
}
