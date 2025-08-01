"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function fetchSafeZonesClient() {
    const supabase = createServerComponentClient({ cookies });
    const { data: zones } = await supabase.from("safe_zones").select("*");
    return zones || [];
}
