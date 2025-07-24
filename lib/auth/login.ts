import { supabase } from "../supabase"

export async function loginWithProvider(provider: "google" | "facebook") {
    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    })

    if (error) throw new Error(error.message)
}