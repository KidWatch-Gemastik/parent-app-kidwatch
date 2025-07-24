'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                router.push('/dashboard')
            } else {
                router.push('/login')
            }
        })
    }, [router])

    return <p className="text-center mt-10">Loading...</p>
}
