"use client"

import { useEffect, useState } from "react"
import { useChildren } from "@/hooks/useChildren"
import type { Child } from "@/types"
import { getAgeFromDate } from "@/lib/function"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSupabaseAuthSession } from "@/hooks/useSupabaseAuthSession"

type Props = {
    initialChildren: (Child & {
        last_location?: {
            latitude: number
            longitude: number
            timestamp: string
        } | null
    })[]
}

export function ChildLocationPage({ initialChildren }: Props) {
    const { user } = useSupabaseAuthSession()
    const [children, setChildren] = useState<Props["initialChildren"]>(initialChildren)
    const { children: refreshedChildren } = useChildren(user?.id || null)

    useEffect(() => {
        if (refreshedChildren.length > 0) {
            setChildren(refreshedChildren)
        }
    }, [refreshedChildren])

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => {
                const age = getAgeFromDate(child.date_of_birth)
                const loc = child.last_location

                return (
                    <Card key={child.id} className="bg-gray-800 text-white rounded-xl shadow-md">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-12 h-12 ring-2 ring-emerald-500/30">
                                    <AvatarImage
                                        src={child.avatar || `/placeholder.svg?height=48&width=48&text=${child.name[0]}`}
                                    />
                                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                                        {child.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-white">{child.name}</h3>
                                    <p className="text-sm text-gray-400">Usia {age} tahun</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div
                                            className={cn(
                                                "h-2 w-2 rounded-full",
                                                child.status === "online" ? "bg-emerald-500" : "bg-gray-500"
                                            )}
                                        />
                                        <span className="text-xs text-gray-400 capitalize">
                                            {child.status || "offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {loc ? (
                                <div className="text-sm text-gray-300">
                                    <p>
                                        Lokasi: <span className="font-medium text-white">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(loc.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Belum ada data lokasi</p>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
