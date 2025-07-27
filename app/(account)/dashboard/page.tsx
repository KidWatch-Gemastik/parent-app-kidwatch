"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Session } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { MapPin, PhoneCall, ShieldCheck, CalendarDays, BarChart3, Bell } from "lucide-react"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"
import DashboardCard from "@/components/layouts/DashboardCard"

export default function DashboardPage() {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) router.push("/login")
            else setSession(session)
        }
        getSession()
    }, [router, supabase])

    const cards = [
        {
            title: "Location Tracking",
            description: "Monitor your child's real-time location and history.",
            action: "View Map",
            icon: <MapPin className="h-4 w-4" />,
        },
        {
            title: "Call & Message Logs",
            description: "View calls and messages sent and received from the watch.",
            action: "View Logs",
            icon: <PhoneCall className="h-4 w-4" />,
        },
        {
            title: "Safe Zones",
            description: "Define and manage safe zones with geofencing.",
            action: "Manage Zones",
            icon: <ShieldCheck className="h-4 w-4" />,
        },
        {
            title: "Daily Schedule",
            description: "Manage your child's daily learning and activity schedule.",
            action: "View Schedule",
            icon: <CalendarDays className="h-4 w-4" />,
        },
        {
            title: "Usage Stats",
            description: "Check screen time, battery level, and more.",
            action: "View Report",
            icon: <BarChart3 className="h-4 w-4" />,
        },
        {
            title: "Notifications",
            description: "Receive alerts for leaving zones or low battery.",
            action: "See Alerts",
            icon: <Bell className="h-4 w-4" />,
        },
    ]

    return (
        <div className="min-h-screen flex bg-gray-950 text-gray-100">
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-mint-900/20 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-mint-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>
            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6">
                    <DashboardHeader title='Dashboard' />
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card) => (
                            <DashboardCard key={card.title} {...card} />
                        ))}
                    </section>
                </main>
            </div>
        </div>
    )
}
