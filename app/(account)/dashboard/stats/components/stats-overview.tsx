"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { Shield, Smartphone, Phone, Activity, MapPin, Users, TrendingUp, Clock } from "lucide-react"
import { ActivityChart } from "./activity-chart"

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  trend?: "up" | "down" | "stable"
  color?: "primary" | "success" | "warning" | "destructive"
}

function StatCard({ title, value, icon, description, trend, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          {trend && (
            <div className="flex items-center text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span className="text-success">+12%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ChildStatsCard({ child }: { child: any }) {
  const totalActivity = child.call_logs + child.app_usages + child.locations

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{child.child_name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2 text-success" />
              <span className="text-muted-foreground">Safe Zones</span>
            </div>
            <div className="text-xl font-bold">{child.safe_zones}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Smartphone className="h-4 w-4 mr-2 text-primary" />
              <span className="text-muted-foreground">Devices</span>
            </div>
            <div className="text-xl font-bold">{child.devices}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-warning" />
              <span className="text-muted-foreground">Call Logs</span>
            </div>
            <div className="text-xl font-bold">{child.call_logs}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-destructive" />
              <span className="text-muted-foreground">Locations</span>
            </div>
            <div className="text-xl font-bold">{child.locations}</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Activity</span>
            <span className="font-semibold">{totalActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsOverview({ userId }: { userId: string }) {
  const { stats, loading, error } = useDashboardStats(userId)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Activity className="h-5 w-5" />
            <span className="font-medium">Error loading statistics</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate totals
  const totals = stats.reduce(
    (acc: any, child:any) => ({
      children: acc.children + 1,
      safeZones: acc.safeZones + child.safe_zones,
      devices: acc.devices + child.devices,
      callLogs: acc.callLogs + child.call_logs,
      appUsages: acc.appUsages + child.app_usages,
      locations: acc.locations + child.locations,
    }),
    { children: 0, safeZones: 0, devices: 0, callLogs: 0, appUsages: 0, locations: 0 },
  )

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Children"
          value={totals.children}
          icon={<Users className="h-4 w-4" />}
          description="Active profiles"
          color="primary"
          trend="stable"
        />

        <StatCard
          title="Safe Zones"
          value={totals.safeZones}
          icon={<Shield className="h-4 w-4" />}
          description="Protected areas"
          color="success"
        />

        <StatCard
          title="Connected Devices"
          value={totals.devices}
          icon={<Smartphone className="h-4 w-4" />}
          description="Monitored devices"
          color="primary"
        />

        <StatCard
          title="Total Activity"
          value={totals.callLogs + totals.appUsages + totals.locations}
          icon={<Activity className="h-4 w-4" />}
          description="Recent events"
          color="warning"
          trend="up"
        />
      </div>

      {stats.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-balance">Activity Analytics & Monitoring</h3>
          <ActivityChart stats={stats} />
        </div>
      )}

      {/* Individual Child Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-balance">Individual Child Statistics</h3>

        {stats.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No children found</p>
                <p className="text-sm">Add your first child to start monitoring their safety.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((child: any) => (
              <ChildStatsCard key={child.child_id} child={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
