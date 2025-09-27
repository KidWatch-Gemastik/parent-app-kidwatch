"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/providers/SupabaseProvider"

interface DailyActivity {
    date: string
    day: string
    calls: number
    locations: number
    total: number
}

export function useActivityTrends(childId: string, days = 7) {
    const { supabase } = useSupabase()
    const [trends, setTrends] = useState<DailyActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!childId) return

        async function fetchActivityTrends() {
            setLoading(true)
            setError(null)

            try {
                const endDate = new Date()
                const startDate = new Date()
                startDate.setDate(endDate.getDate() - days)

                const [callLogsRes, locationsRes] = await Promise.all([
                    supabase
                        .from("call_logs")
                        .select("timestamp")
                        .eq("child_id", childId)
                        .gte("timestamp", startDate.toISOString())
                        .lte("timestamp", endDate.toISOString()),
                    supabase
                        .from("locations")
                        .select("timestamp")
                        .eq("child_id", childId)
                        .gte("timestamp", startDate.toISOString())
                        .lte("timestamp", endDate.toISOString()),
                ])

                if (callLogsRes.error) throw callLogsRes.error
                if (locationsRes.error) throw locationsRes.error

                const dailyData: Record<string, DailyActivity> = {}

                // Initialize all days with zero counts
                for (let i = 0; i < days; i++) {
                    const date = new Date()
                    date.setDate(endDate.getDate() - i)
                    const dateStr = date.toISOString().split("T")[0]
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

                    dailyData[dateStr] = {
                        date: dateStr,
                        day: dayName,
                        calls: 0,
                        locations: 0,
                        total: 0,
                    }
                }

                // Count calls by day
                callLogsRes.data?.forEach((call) => {
                    const date = new Date(call.timestamp).toISOString().split("T")[0]
                    if (dailyData[date]) {
                        dailyData[date].calls++
                    }
                })

                // Count locations by day
                locationsRes.data?.forEach((location) => {
                    const date = new Date(location.timestamp).toISOString().split("T")[0]
                    if (dailyData[date]) {
                        dailyData[date].locations++
                    }
                })

                // Calculate totals
                Object.values(dailyData).forEach((day) => {
                    day.total = day.calls + day.locations
                })

                setTrends(Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date)))
            } catch (err: any) {
                console.error("[v0] Activity trends error:", err)
                setError(err.message || "An error occurred while loading activity trends.")
            }

            setLoading(false)
        }

        fetchActivityTrends()
    }, [childId, days, supabase])

    return { trends, loading, error }
}
