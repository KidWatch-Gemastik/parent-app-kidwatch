"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AppUsageItem = {
  id: number | string
  device_id: string
  package_name: string
  app_name: string | null
  usage_seconds: number
  period_start: string
  period_end: string
  last_used: string | null
  created_at?: string
}

export function AppUsage({ usages }: { usages: AppUsageItem[] }) {
  // group by app_name/package_name
  const group = usages.reduce<Record<string, { app: string; total: number; last_used?: string; entries: number }>>(
    (acc, u) => {
      const key = u.app_name || u.package_name
      if (!acc[key]) acc[key] = { app: key, total: 0, last_used: u.last_used || undefined, entries: 0 }
      acc[key].total += u.usage_seconds
      acc[key].entries += 1
      if (u.last_used && (!acc[key].last_used || new Date(u.last_used) > new Date(acc[key].last_used!))) {
        acc[key].last_used = u.last_used
      }
      return acc
    },
    {},
  )

  const rows = Object.values(group)
    .sort((a, b) => b.total - a.total)
    .slice(0, 20)

  const fmt = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Apps by Usage</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No app usage data found.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.app} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{row.app}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.entries} sessions · Last used {row.last_used ? new Date(row.last_used).toLocaleString() : "—"}
                  </p>
                </div>
                <div className="text-sm font-semibold">{fmt(row.total)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
