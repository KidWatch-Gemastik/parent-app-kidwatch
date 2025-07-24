"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

export function useSupabaseAuthSession() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const init = async () => {
            const { data } = await supabase.auth.getSession()
            if (mounted) {
                setSession(data.session)
                setLoading(false)
            }
        }

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        init()

        return () => {
            mounted = false
            listener.subscription.unsubscribe()
        }
    }, [])

    return {
        session,
        user: session?.user,
        loading,
    }
}
