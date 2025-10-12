"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/providers/SupabaseProvider"

interface CallLog {
  id: string
  phone_number: string
  type: string
  duration: number
  timestamp: string
}

interface Location {
  id: string
  latitude: number
  longitude: number
  accuracy: number
  speed?: number
  altitude?: number
  source: string
  timestamp: string
  safe_zone_name?: string
}

interface AppUsage {
  id: number
  device_id: string
  package_name: string
  app_name: string | null
  usage_seconds: number
  period_start: string
  period_end: string
  last_used: string | null
  created_at: string
}

interface Device {
  id: string
  device_id: string
  os: string | null
  status: string | null
  platform: string | null
  ip_address: string | null
  created_at: string
  battery_level?: number | null
  is_charging?: boolean | null
  is_online?: boolean | null
  network_type?: string | null
  last_seen?: string | null
  updated_at?: string | null
}

interface ChatMessage {
  id: string
  sender_role: string
  message: string
  created_at: string
  is_read: boolean
  file_url?: string
  file_type?: string
  file_name?: string
}

interface SafetyAlert {
  id: string
  type: string
  message: string
  severity: "low" | "medium" | "high"
  timestamp: string
  resolved: boolean
}

interface ChildDetails {
  callLogs: CallLog[]
  locations: Location[]
  appUsages: AppUsage[]
  safeZones: Array<{ id: string; name: string; latitude: number; longitude: number; radius: number }>
  devices: Device[]
  chatMessages: ChatMessage[]
  safetyAlerts: SafetyAlert[]
  dailyStats: {
    totalCalls: number
    totalMessages: number
    timeInSafeZones: number
    averageSpeed: number
    activeDevices: number
  }
  weeklyTrends: Array<{
    day: string
    calls: number
    messages: number
    locations: number
    safeZoneTime: number
  }>
}

export function useChildDetails(childId: string) {
  const { supabase } = useSupabase()
  const [details, setDetails] = useState<ChildDetails>({
    callLogs: [],
    locations: [],
    appUsages: [],
    safeZones: [],
    devices: [],
    chatMessages: [],
    safetyAlerts: [],
    dailyStats: {
      totalCalls: 0,
      totalMessages: 0,
      timeInSafeZones: 0,
      averageSpeed: 0,
      activeDevices: 0,
    },
    weeklyTrends: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!childId) return

    async function fetchChildDetails() {
      setLoading(true)
      setError(null)

      try {
        const [
          callLogsRes,
          locationsRes,
          safeZonesRes,
          devicesRes,
          chatMessagesRes,
          todayCallsRes,
          todayMessagesRes,
          weeklyDataRes,
        ] = await Promise.all([
          supabase
            .from("call_logs")
            .select("id, phone_number, type, duration, timestamp")
            .eq("child_id", childId)
            .order("timestamp", { ascending: false })
            .limit(50),
          supabase
            .from("locations")
            .select("id, latitude, longitude, accuracy, speed, altitude, source, timestamp")
            .eq("child_id", childId)
            .eq("is_active", true)
            .order("timestamp", { ascending: false })
            .limit(100),
          supabase.from("safe_zones").select("id, name, latitude, longitude, radius").eq("child_id", childId),
          supabase
            .from("devices")
            .select(
              "id, device_id, os, status, platform, ip_address, created_at, battery_level, is_charging, is_online, network_type, last_seen, updated_at",
            )
            .eq("child_id", childId)
            .order("created_at", { ascending: false }),
          supabase
            .from("chat_messages")
            .select("id, sender_role, message, created_at, is_read, file_url, file_type, file_name")
            .eq("child_id", childId)
            .order("created_at", { ascending: false })
            .limit(50),
          // Today's call count
          supabase
            .from("call_logs")
            .select("id", { count: "exact" })
            .eq("child_id", childId)
            .gte("timestamp", new Date().toISOString().split("T")[0]),
          // Today's message count
          supabase
            .from("chat_messages")
            .select("id", { count: "exact" })
            .eq("child_id", childId)
            .gte("created_at", new Date().toISOString().split("T")[0]),
          // Weekly data for trends
          supabase
            .from("call_logs")
            .select("timestamp")
            .eq("child_id", childId)
            .gte("timestamp", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        ])

        if (callLogsRes.error) throw callLogsRes.error
        if (locationsRes.error) throw locationsRes.error
        if (safeZonesRes.error) throw safeZonesRes.error
        if (devicesRes.error) throw devicesRes.error
        if (chatMessagesRes.error) throw chatMessagesRes.error

        const processedLocations =
          locationsRes.data?.map((location) => {
            const safeZone = safeZonesRes.data?.find((zone) => {
              const distance = calculateDistance(location.latitude, location.longitude, zone.latitude, zone.longitude)
              return distance <= zone.radius
            })

            return {
              ...location,
              safe_zone_name: safeZone?.name,
            }
          }) || []

        // Fetch app usages after we know the child's devices
        let appUsagesData: AppUsage[] = []
        const deviceIds = (devicesRes.data || []).map((d) => d.device_id).filter(Boolean)
        if (deviceIds.length > 0) {
          const appUsagesRes = await supabase
            .from("app_usages")
            .select(
              "id, device_id, package_name, app_name, usage_seconds, period_start, period_end, last_used, created_at",
            )
            .in("device_id", deviceIds)
            .order("period_end", { ascending: false })
            .limit(200)
          if (appUsagesRes.error) throw appUsagesRes.error
          appUsagesData = (appUsagesRes.data as any) || []
        }

        const safeZoneLocations = processedLocations.filter((loc) => loc.safe_zone_name)
        const averageSpeed =
          processedLocations.reduce((sum, loc) => sum + (loc.speed || 0), 0) / processedLocations.length || 0
        const activeDevices =
          devicesRes.data?.filter((device: any) =>
            typeof device.is_online === "boolean" ? device.is_online : device.status === "online",
          ).length || 0

        const weeklyTrends = generateWeeklyTrends(
          callLogsRes.data || [],
          chatMessagesRes.data || [],
          processedLocations,
        )

        const safetyAlerts = generateSafetyAlerts(processedLocations, callLogsRes.data || [], devicesRes.data || [])

        setDetails({
          callLogs: callLogsRes.data || [],
          locations: processedLocations,
          appUsages: appUsagesData,
          safeZones: safeZonesRes.data || [],
          devices: devicesRes.data || [],
          chatMessages: chatMessagesRes.data || [],
          safetyAlerts,
          dailyStats: {
            totalCalls: todayCallsRes.count || 0,
            totalMessages: todayMessagesRes.count || 0,
            timeInSafeZones: safeZoneLocations.length,
            averageSpeed: Math.round(averageSpeed * 3.6), // Convert to km/h
            activeDevices,
          },
          weeklyTrends,
        })
      } catch (err: any) {
        console.error("[v0] Child details error:", err)
        setError(err.message || "An error occurred while loading child details.")
      }

      setLoading(false)
    }

    fetchChildDetails()
  }, [childId, supabase])

  return { details, loading, error }
}

function generateWeeklyTrends(calls: any[], messages: any[], locations: any[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const trends = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString()
    const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString()

    const dayCalls = calls.filter((call) => call.timestamp >= dayStart && call.timestamp <= dayEnd).length
    const dayMessages = messages.filter((msg) => msg.created_at >= dayStart && msg.created_at <= dayEnd).length
    const dayLocations = locations.filter((loc) => loc.timestamp >= dayStart && loc.timestamp <= dayEnd).length
    const safeZoneTime = locations.filter(
      (loc) => loc.timestamp >= dayStart && loc.timestamp <= dayEnd && loc.safe_zone_name,
    ).length

    trends.push({
      day: days[date.getDay()],
      calls: dayCalls,
      messages: dayMessages,
      locations: dayLocations,
      safeZoneTime,
    })
  }

  return trends
}

function generateSafetyAlerts(locations: any[], calls: any[], devices: any[]): SafetyAlert[] {
  const alerts: SafetyAlert[] = []

  // Check for locations outside safe zones
  const recentUnsafeLocations = locations.filter(
    (loc) => !loc.safe_zone_name && new Date(loc.timestamp) > new Date(Date.now() - 2 * 60 * 60 * 1000),
  )

  if (recentUnsafeLocations.length > 5) {
    alerts.push({
      id: "unsafe-location-" + Date.now(),
      type: "location",
      message: `Child has been outside safe zones for extended period`,
      severity: "medium",
      timestamp: new Date().toISOString(),
      resolved: false,
    })
  }

  // Check for excessive speed
  const highSpeedLocations = locations.filter((loc) => (loc.speed || 0) > 50) // 50 m/s = 180 km/h
  if (highSpeedLocations.length > 0) {
    alerts.push({
      id: "high-speed-" + Date.now(),
      type: "speed",
      message: `High speed detected: ${Math.round(highSpeedLocations[0].speed * 3.6)} km/h`,
      severity: "high",
      timestamp: new Date().toISOString(),
      resolved: false,
    })
  }

  // Check for offline devices
  const offlineDevices = devices.filter((device) => device.status === "offline")
  if (offlineDevices.length > 0) {
    alerts.push({
      id: "offline-device-" + Date.now(),
      type: "device",
      message: `${offlineDevices.length} device(s) offline`,
      severity: "low",
      timestamp: new Date().toISOString(),
      resolved: false,
    })
  }

  return alerts
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
