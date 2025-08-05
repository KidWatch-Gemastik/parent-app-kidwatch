"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

export function useSupabaseAuthSession() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let unsubscribed = false

        const initSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (!unsubscribed) {
                setSession(data.session)
                setLoading(false)
            }
        }

        initSession()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (!unsubscribed) {
                setSession(newSession)
                setLoading(false)
            }
        })

        return () => {
            unsubscribed = true
            listener.subscription.unsubscribe()
        }
    }, [])

    const user: User | undefined = session?.user
    const provider = user?.app_metadata?.provider ?? null

    return {
        session,
        user,
        loading,
        provider,
    }
}
