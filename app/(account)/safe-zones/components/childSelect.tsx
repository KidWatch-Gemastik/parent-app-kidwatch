"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useMemo, useState } from "react"
import { MaleIcon } from "@/app/svg/Male"
import { FemaleIcon } from "@/app/svg/FemaleIcon"
import { Child } from "@/types"

type Props = {
    childrenList: Child[]
    value: string
    onChange: (id: string) => void
}

export function ChildSelect({ childrenList, value, onChange }: Props) {
    const [search, setSearch] = useState("")

    const filteredChildren = useMemo(() => {
        return childrenList.filter((child) =>
            child.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, childrenList])

    return (
        <div className="space-y-2">
            <Label
                htmlFor="child"
                className="text-sm font-semibold text-gray-300 flex items-center gap-2"
            >
                <div className="w-2 h-2 bg-mint-400 rounded-full" />
                Untuk Anak
            </Label>

            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="bg-gray-800/60 w-full border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl h-12">
                    <SelectValue placeholder="Pilih anak..." />
                </SelectTrigger>

                <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white max-h-[300px] overflow-y-auto">
                    <div className="px-2 py-1 sticky top-0 bg-gray-900 z-10">
                        <Input
                            placeholder="Cari anak..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 rounded-md bg-gray-800 border border-gray-600 text-sm text-white"
                        />
                    </div>

                    {filteredChildren.length > 0 ? (
                        filteredChildren.map((child) => (
                            <SelectItem
                                key={child.id}
                                value={child.id}
                                className="hover:bg-emerald-500/10 hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400 flex items-center gap-3"
                            >
                                <Avatar className="w-6 h-6">
                                    <AvatarImage
                                        src={`https://api.dicebear.com/7.x/${child.sex === "Laki-laki" ? "micah" : "avataaars"
                                            }/svg?seed=${child.name}`}
                                        alt={child.name}
                                    />
                                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{child.name}</span>
                                {child.sex === "Laki-laki" ? (
                                    <MaleIcon className="w-4 h-4 ml-auto text-blue-400" />
                                ) : (
                                    <FemaleIcon className="w-4 h-4 ml-auto text-pink-400" />
                                )}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-2 text-sm text-gray-400">Anak tidak ditemukan.</div>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}
