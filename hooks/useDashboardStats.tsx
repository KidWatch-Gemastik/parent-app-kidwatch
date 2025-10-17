import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";

interface ChildStats {
  child_id: string;
  child_name: string;
  safe_zones: number;
  devices: number;
  call_logs: number;
  app_usages: number;
  locations: number;
}

type NumericStatsKeys = "safe_zones" | "devices" | "call_logs" | "locations";

export function useDashboardStats(userId: string) {
  const { supabase } = useSupabase();
  const [stats, setStats] = useState<ChildStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchStats() {
      setLoading(true);
      setError(null);

      try {
        const childrenRes = await supabase
          .from("children")
          .select("id, name")
          .eq("parent_id", userId);

        if (childrenRes.error) throw childrenRes.error;

        const childrenMap: Record<string, string> = {};
        childrenRes.data?.forEach((child) => {
          childrenMap[child.id] = child.name;
        });

        const childIds = childrenRes.data?.map((c) => c.id) || [];

        const [
          safeZonesRes,
          callLogsRes,
          locationsRes,
          devicesRes,
          appUsagesRes,
        ] = await Promise.all([
          supabase
            .from("safe_zones")
            .select("child_id")
            .in("child_id", childIds),
          supabase
            .from("call_logs")
            .select("child_id")
            .in("child_id", childIds),
          supabase
            .from("locations")
            .select("child_id")
            .in("child_id", childIds),
          supabase
            .from("devices")
            .select("device_id, child_id")
            .in("child_id", childIds),
          supabase.from("app_usages").select("device_id"),
        ]);

        if (safeZonesRes.error) throw safeZonesRes.error;
        if (callLogsRes.error) throw callLogsRes.error;
        if (locationsRes.error) throw locationsRes.error;
        if (devicesRes.error) throw devicesRes.error;
        if (appUsagesRes.error) throw appUsagesRes.error;

        const statsMap: Record<string, ChildStats> = {};

        const ensureChild = (id: string) => {
          if (!statsMap[id]) {
            statsMap[id] = {
              child_id: id,
              child_name: childrenMap[id] || "Unknown Child",
              safe_zones: 0,
              devices: 0,
              call_logs: 0,
              app_usages: 0,
              locations: 0,
            };
          }
        };

        const addCount = (data: any[], key: NumericStatsKeys) => {
          data.forEach((row: any) => {
            const id = row.child_id;
            if (!id) return;
            ensureChild(id);
            statsMap[id][key] += 1;
          });
        };

        addCount(safeZonesRes.data || [], "safe_zones");
        addCount(callLogsRes.data || [], "call_logs");
        addCount(locationsRes.data || [], "locations");
        addCount(devicesRes.data || [], "devices");

        const deviceToChild: Record<string, string> = {};
        (devicesRes.data || []).forEach((d: any) => {
          if (d.device_id) deviceToChild[d.device_id] = d.child_id;
        });

        (appUsagesRes.data || []).forEach((u: any) => {
          const childId = deviceToChild[u.device_id];
          if (!childId) return;
          ensureChild(childId);
          statsMap[childId].app_usages += 1;
        });

        childIds.forEach((id) => ensureChild(id));

        setStats(Object.values(statsMap));
      } catch (err: any) {
        console.error("[DashboardStats] Error:", err);
        setError(err.message || "Failed to load stats");
      }

      setLoading(false);
    }

    fetchStats();
  }, [supabase, userId]);

  return { stats, loading, error };
}
