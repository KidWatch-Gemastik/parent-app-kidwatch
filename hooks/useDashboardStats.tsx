"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/providers/SupabaseProvider"

interface ChildStats {
    child_id: string
    child_name: string
    safe_zones: number
    devices: number
    call_logs: number
    activity_logs: number
    locations: number
}

type NumericStatsKeys = "safe_zones" | "devices" | "call_logs" | "activity_logs" | "locations"

export function useDashboardStats() {
    const { supabase } = useSupabase()
    const [stats, setStats] = useState<ChildStats[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStats() {
            setLoading(true)
            setError(null)

            try {
                const childrenRes = await supabase.from("children").select("id, name")
                if (childrenRes.error) throw childrenRes.error

                // Create children lookup map
                const childrenMap: Record<string, string> = {}
                childrenRes.data?.forEach((child) => {
                    childrenMap[child.id] = child.name
                })

                const [safeZonesRes, callLogsRes, locationsRes] = await Promise.all([
                    supabase.from("safe_zones").select("child_id"),
                    supabase.from("call_logs").select("child_id"),
                    supabase.from("locations").select("child_id"),
                ])

                // Check for errors
                if (safeZonesRes.error) throw safeZonesRes.error
                if (callLogsRes.error) throw callLogsRes.error
                if (locationsRes.error) throw locationsRes.error

                // Create map to count per child
                const statsMap: Record<string, ChildStats> = {}

                const addCount = (data: any[], key: NumericStatsKeys) => {
                    data.forEach((row: any) => {
                        const id = row.child_id
                        if (!statsMap[id]) {
                            statsMap[id] = {
                                child_id: id,
                                child_name: childrenMap[id] || "Unknown Child",
                                safe_zones: 0,
                                devices: 0,
                                call_logs: 0,
                                activity_logs: 0,
                                locations: 0,
                            }
                        }
                        statsMap[id][key] += 1
                    })
                }

                addCount(safeZonesRes.data!, "safe_zones")
                addCount(callLogsRes.data!, "call_logs")
                addCount(locationsRes.data!, "locations")

                childrenRes.data?.forEach((child) => {
                    if (!statsMap[child.id]) {
                        statsMap[child.id] = {
                            child_id: child.id,
                            child_name: child.name,
                            safe_zones: 0,
                            devices: 0,
                            call_logs: 0,
                            activity_logs: 0,
                            locations: 0,
                        }
                    }
                })

                setStats(Object.values(statsMap))
            } catch (err: any) {
                console.error("[v0] Dashboard stats error:", err)
                setError(err.message || "An error occurred while loading statistics.")
            }

            setLoading(false)
        }

        fetchStats()
    }, [supabase])

    return { stats, loading, error }
}
