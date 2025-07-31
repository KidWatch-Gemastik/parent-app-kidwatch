"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Location = {
    latitude: number
    longitude: number
    accuracy: number
    timestamp: string
}

/**
 * Fetch the most recent location for a specific child.
 * @param childId - UUID of the child
 * @returns Latest location data or null
 */
export async function fetchLatestLocation(childId: string): Promise<Location | null> {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
        .from("locations")
        .select("latitude, longitude, accuracy, timestamp")
        .eq("child_id", childId)
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        console.error("❌ Failed to fetch latest location:", error.message)
        return null
    }

    if (!data) {
        console.warn("⚠️ No location data found for child:", childId)
        return null
    }

    return data
}
