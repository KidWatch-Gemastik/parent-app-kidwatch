"use server"

import { createSupabaseServer } from "../supabase-serverles"
import { cookies } from "next/headers"
import type { SafeZone, Child } from "@/types"

// ===================== FETCH SAFE ZONES =====================
export async function fetchSafeZones(): Promise<SafeZone[]> {
    const cookieStore = await cookies()
    const supabase = createSupabaseServer(cookieStore)

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return []

    // Ambil anak-anak user
    const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id, name")
        .eq("parent_id", user.user.id)
    if (childrenError || !children) return []

    const childIds = children.map(c => c.id)
    if (!childIds.length) return []

    // Ambil safe zones
    const { data: safeZones, error: safeZonesError } = await supabase
        .from("safe_zones")
        .select("*")
        .in("child_id", childIds)
        .order("created_at", { ascending: false })
    if (safeZonesError || !safeZones) return []

    return safeZones.map(zone => {
        const child = children.find(c => c.id === zone.child_id)
        return { ...zone, child_name: child?.name ?? "Tidak diketahui" }
    })
}

// ===================== CREATE SAFE ZONE =====================
export async function addSafeZone(
    zoneData: Omit<SafeZone, "id" | "created_at" | "child_name">
): Promise<{ success: boolean; message: string }> {
    const cookieStore = await cookies()
    const supabase = createSupabaseServer(cookieStore)

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return { success: false, message: "Anda belum login." }

    const { error } = await supabase.from("safe_zones").insert(zoneData)
    if (error) return { success: false, message: error.message }

    return { success: true, message: "Zona aman berhasil ditambahkan!" }
}

// ===================== UPDATE SAFE ZONE =====================
export async function updateSafeZone(
    zoneData: Omit<SafeZone, "created_at" | "child_name">
): Promise<{ success: boolean; message: string }> {
    const cookieStore = await cookies()
    const supabase = createSupabaseServer(cookieStore)

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return { success: false, message: "Anda belum login." }

    const { error } = await supabase
        .from("safe_zones")
        .update(zoneData)
        .eq("id", zoneData.id)
    if (error) return { success: false, message: error.message }

    return { success: true, message: "Zona aman berhasil diperbarui!" }
}

// ===================== DELETE SAFE ZONE =====================
export async function deleteSafeZone(
    zoneId: string
): Promise<{ success: boolean; message: string }> {
    const cookieStore = await cookies()
    const supabase = createSupabaseServer(cookieStore)

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return { success: false, message: "Anda belum login." }

    const { error } = await supabase.from("safe_zones").delete().eq("id", zoneId)
    if (error) return { success: false, message: error.message }

    return { success: true, message: "Zona aman berhasil dihapus!" }
}

// ===================== FETCH CHILDREN =====================
export async function fetchChildrenForSafeZones(): Promise<Child[]> {
    const cookieStore = await cookies()
    const supabase = createSupabaseServer(cookieStore)

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return []

    const { data, error } = await supabase
        .from("children")
        .select("id, name, date_of_birth, sex")
        .eq("parent_id", user.user.id)
    if (error || !data) return []

    return data
}
