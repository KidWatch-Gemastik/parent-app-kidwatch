"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, Wifi, WifiOff, Smartphone, Clock } from "lucide-react"

type Device = {
  id: string
  device_id: string
  os?: string | null
  status?: string | null
  platform?: string | null
  ip_address?: string | null
  created_at?: string
  battery_level?: number | null
  is_charging?: boolean | null
  is_online?: boolean | null
  network_type?: string | null
  last_seen?: string | null
  updated_at?: string | null
}

export function DeviceDiagnostics({ devices }: { devices: Device[] }) {
  if (!devices || devices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No devices found</p>
        </CardContent>
      </Card>
    )
  }

  const batteryIcon = (level?: number | null, charging?: boolean | null) => {
    if (charging) return <BatteryCharging className="h-4 w-4 text-green-500" />
    if (typeof level !== "number") return <BatteryMedium className="h-4 w-4 text-muted-foreground" />
    if (level >= 80) return <BatteryFull className="h-4 w-4 text-green-500" />
    if (level >= 30) return <BatteryMedium className="h-4 w-4 text-yellow-500" />
    return <BatteryLow className="h-4 w-4 text-red-500" />
  }

  const onlineBadge = (is_online?: boolean | null, status?: string | null) => {
    const online = typeof is_online === "boolean" ? is_online : status === "online"
    return (
      <Badge variant={online ? "secondary" : "destructive"} className="text-xs">
        {online ? "Online" : "Offline"}
      </Badge>
    )
  }

  const formatTime = (ts?: string | null) => {
    if (!ts) return "—"
    try {
      return new Date(ts).toLocaleString()
    } catch {
      return ts
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Device Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {devices.map((d) => (
          <div key={d.id} className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="font-medium">{d.device_id}</span>
                <span className="text-xs text-muted-foreground">({d.platform || d.os || "unknown"})</span>
              </div>
              <div className="flex items-center gap-2">
                {onlineBadge(d.is_online, d.status)}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last seen: {formatTime(d.last_seen || d.updated_at)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Battery</span>
                  <div className="flex items-center gap-1">
                    {batteryIcon(d.battery_level ?? null, d.is_charging ?? null)}
                    <span>{typeof d.battery_level === "number" ? `${d.battery_level}%` : "—"}</span>
                  </div>
                </div>
                <Progress value={typeof d.battery_level === "number" ? d.battery_level : 0} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <div className="flex items-center gap-1">
                    {d.is_online ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4" />}
                    <span>{d.network_type || "—"}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">IP: {d.ip_address || "—"}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Charging</span>
                  <span>{d.is_charging === true ? "Yes" : d.is_charging === false ? "No" : "—"}</span>
                </div>
                <div className="text-xs text-muted-foreground">Created: {formatTime(d.created_at)}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
