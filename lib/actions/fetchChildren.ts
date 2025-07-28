"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function fetchChildrenFromServer() {
    const supabase = createServerActionClient({ cookies })

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id)

    if (error) return []

    return data
}
