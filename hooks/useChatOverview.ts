"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type ChatOverview = {
    child_id: string
    sex: "Laki-laki" | "Perempuan"
    child_name: string
    last_message?: string
    file_url: string
    file_type: string
    file_name: string
    last_time?: string | null
    isOnline: boolean
}

export function useChatOverview(parentId: string) {
    const [list, setList] = useState<ChatOverview[]>([])
    const [loading, setLoading] = useState(true)

    const fetchOverview = async () => {
        setLoading(true)

        const { data: children, error } = await supabase
            .from("children")
            .select("id, name, sex")
            .eq("parent_id", parentId)

        if (error || !children) {
            setLoading(false)
            return
        }

        if (children.length === 0) {
            setList([])
            setLoading(false)
            return
        }

        const childIds = children.map((c) => c.id)
        const { data: lastMessages } = await supabase
            .from("chat_messages")
            .select("child_id, message, file_url, file_type, file_name, created_at")
            .in("child_id", childIds)
            .order("created_at", { ascending: false })

        const overview: ChatOverview[] = children.map((child) => {
            const lastMsg = lastMessages?.find((msg) => msg.child_id === child.id)
            const lastTime = lastMsg?.created_at || null

            const displayMsg = lastMsg
                ? lastMsg.message ||
                (lastMsg.file_type === "image"
                    ? "🖼️ Foto"
                    : lastMsg.file_type === "video"
                        ? "🎥 Video"
                        : lastMsg.file_type === "audio"
                            ? "🎤 Audio"
                            : `📎 ${lastMsg.file_name || "File"}`)
                : "Belum ada pesan"

            const isOnline = lastTime
                ? Date.now() - new Date(lastTime).getTime() < 60_000
                : false

            return {
                child_id: child.id,
                child_name: child.name,
                sex: child.sex,
                last_message: displayMsg,
                last_time: lastTime,
                isOnline,
                file_url: lastMsg?.file_url || "",
                file_type: lastMsg?.file_type || "",
                file_name: lastMsg?.file_name || ""
            } satisfies ChatOverview
        })


        setList(overview)
        setLoading(false)
    }

    useEffect(() => {
        if (parentId) fetchOverview()
    }, [parentId])

    useEffect(() => {
        const interval = setInterval(() => {
            setList((prev) =>
                prev.map((child) => ({
                    ...child,
                    isOnline: child.last_time
                        ? Date.now() - new Date(child.last_time).getTime() < 60_000
                        : false
                }))
            )
        }, 30_000)

        return () => clearInterval(interval)
    }, [])

    return { list, loading, refetch: fetchOverview }
}
