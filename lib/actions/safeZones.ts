"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { SafeZone, Child } from "@/types"

export async function fetchSafeZones(): Promise<SafeZone[]> {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return []

    const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id, name")
        .eq("parent_id", session.user.id)

    if (childrenError || !children) {
        console.error("Error fetching children:", childrenError)
        return []
    }

    const childIds = children.map((c) => c.id)
    if (childIds.length === 0) return []

    const { data: safeZonesData, error: safeZonesError } = await supabase
        .from("safe_zones")
        .select("*")
        .in("child_id", childIds)
        .order("created_at", { ascending: false })

    if (safeZonesError || !safeZonesData) {
        console.error("Error fetching safe zones:", safeZonesError)
        return []
    }

    return safeZonesData.map((zone) => {
        const child = children.find((c) => c.id === zone.child_id)
        return {
            ...zone,
            child_name: child?.name ?? "Tidak diketahui",
        }
    })
}

export async function addSafeZone(
    zoneData: Omit<SafeZone, "id" | "created_at" | "child_name">
): Promise<{ success: boolean; message: string }> {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
        return { success: false, message: "Anda belum login." }
    }

    const { error } = await supabase.from("safe_zones").insert(zoneData)

    if (error) {
        console.error("Error adding safe zone:", error)
        return { success: false, message: error.message }
    }

    return { success: true, message: "Zona aman berhasil ditambahkan!" }
}

export async function updateSafeZone(
    zoneData: Omit<SafeZone, "created_at" | "child_name">
): Promise<{ success: boolean; message: string }> {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
        return { success: false, message: "Anda belum login." }
    }

    const { error } = await supabase
        .from("safe_zones")
        .update(zoneData)
        .eq("id", zoneData.id)

    if (error) {
        console.error("Error updating safe zone:", error)
        return { success: false, message: error.message }
    }

    return { success: true, message: "Zona aman berhasil diperbarui!" }
}


export async function deleteSafeZone(
    zoneId: string
): Promise<{ success: boolean; message: string }> {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
        return { success: false, message: "Anda belum login." }
    }

    const { error } = await supabase
        .from("safe_zones")
        .delete()
        .eq("id", zoneId)

    if (error) {
        console.error("Error deleting safe zone:", error)
        return { success: false, message: error.message }
    }

    return { success: true, message: "Zona aman berhasil dihapus!" }
}

export async function fetchChildrenForSafeZones(): Promise<Child[]> {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return []

    const { data, error } = await supabase
        .from("children")
        .select("id, name, date_of_birth, sex")
        .eq("parent_id", session.user.id)


    if (error || !data) {
        console.error("Error fetching children:", error)
        return []
    }

    return data
}
