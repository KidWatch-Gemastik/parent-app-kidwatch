// app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const hash = window.location.hash.substring(1) 
        const params = new URLSearchParams(hash)

        const access_token = params.get("access_token")
        const refresh_token = params.get("refresh_token")

        if (access_token && refresh_token) {
            const supabase = createClientComponentClient()

            supabase.auth
                .setSession({
                    access_token,
                    refresh_token,
                })
                .then(({ error }) => {
                    if (error) {
                        console.error("Failed to set session", error)
                        router.replace("/login?error=invalid_or_expired")
                    } else {
                        router.replace("/dashboard")
                    }
                })
        } else {
            router.replace("/login?error=invalid_or_expired")
        }
    }, [router])

    return <p>Logging in... please wait</p>
}
