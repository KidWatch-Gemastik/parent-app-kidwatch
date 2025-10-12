"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";

export interface ChildDetails {
  callLogs: any[];
  locations: any[];
  safeZones: any[];
  devices: any[];
  appUsages: any[];
  chatMessages: any[];
  stats: {
    totalCalls: number;
    totalMessages: number;
    totalZones: number;
    activeDevices: number;
  };
}

export function useChildDetails(childId?: string) {
  const { supabase } = useSupabase();
  const [details, setDetails] = useState<ChildDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!childId) return;

    async function fetchChildData() {
      try {
        setLoading(true);
        setError(null);

        const [
          callLogs,
          locations,
          safeZones,
          devices,
          appUsages,
          chatMessages,
        ] = await Promise.all([
          supabase.from("call_logs").select("*").eq("child_id", childId),
          supabase.from("locations").select("*").eq("child_id", childId),
          supabase.from("safe_zones").select("*").eq("child_id", childId),
          supabase.from("devices").select("*").eq("child_id", childId),
          supabase.from("app_usages").select("*").eq("child_id", childId),
          supabase.from("chat_messages").select("*").eq("child_id", childId),
        ]);

        if (
          callLogs.error ||
          locations.error ||
          safeZones.error ||
          devices.error ||
          appUsages.error ||
          chatMessages.error
        ) {
          console.error("Call Logs error:", callLogs.error);
          console.error("Locations error:", locations.error);
          console.error("Safe Zones error:", safeZones.error);
          console.error("Devices error:", devices.error);
          console.error("App Usages error:", appUsages.error);
          console.error("Chat Messages error:", chatMessages.error);
          throw new Error("Failed fetching some data.");
        }

        setDetails({
          callLogs: callLogs.data || [],
          locations: locations.data || [],
          safeZones: safeZones.data || [],
          devices: devices.data || [],
          appUsages: appUsages.data || [],
          chatMessages: chatMessages.data || [],
          stats: {
            totalCalls: callLogs.data?.length || 0,
            totalMessages: chatMessages.data?.length || 0,
            totalZones: safeZones.data?.length || 0,
            activeDevices:
              devices.data?.filter((d) => d.is_online)?.length || 0,
          },
        });
      } catch (err: any) {
        console.error("Error loading child details:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChildData();
  }, [childId, supabase]);

  return { details, loading, error };
}
