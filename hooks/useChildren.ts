import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Child } from "@/types"

export function useChildren(userId: string | null) {
    const [children, setChildren] = useState<Child[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!userId) {
            setIsLoading(false)
            return
        }

        const fetchChildren = async () => {
            const { data, error } = await supabase
                .from("children")
                .select("*")
                .eq("parent_id", userId)

            if (!error && data) {
                setChildren(data)
            }
            setIsLoading(false)
        }

        fetchChildren()
    }, [userId])

    return { children, isLoading }
}
