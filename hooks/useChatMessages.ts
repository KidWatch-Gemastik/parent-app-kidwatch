"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export type ChatMessage = {
    id: string
    parent_id: string
    child_id: string
    file_url: string
    file_type: string
    file_name: string
    sender_role: "parent" | "child"
    message: string
    created_at: string
}

export function useChatMessages(childId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("child_id", childId)
            .order("created_at", { ascending: true })
            .limit(50)

        if (!error && data) setMessages(data as ChatMessage[])
        setLoading(false)
    }, [childId])

    const sendMessage = useCallback(async (message: string, sender_role: "parent" | "child", parentId?: string) => {
        if (!message.trim()) return

        await supabase.from("chat_messages").insert({
            child_id: childId,
            parent_id: parentId,
            sender_role,
            message
        })
    }, [childId])

    useEffect(() => {
        fetchMessages()

        const channel = supabase
            .channel(`chat-${childId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "chat_messages", filter: `child_id=eq.${childId}` },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as ChatMessage])
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [childId, fetchMessages])

    return { messages, loading, sendMessage }
}
