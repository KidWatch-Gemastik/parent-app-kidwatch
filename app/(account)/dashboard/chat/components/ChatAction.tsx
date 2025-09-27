"use client"

import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ChatActionsProps = {
    onClearChat: () => Promise<void> | void
    onSearch: (query: string) => void
}

export default function ChatActions({ onClearChat, onSearch }: ChatActionsProps) {
    const [openSearch, setOpenSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [clearing, setClearing] = useState(false)

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        onSearch(value)
    }

    const handleClearClick = async () => {
        if (clearing) return
        setClearing(true)
        try {
            await onClearChat()
        } finally {
            setClearing(false)
        }
    }

    return (
        <div className="flex items-center gap-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 hover:text-emerald-400 h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setOpenSearch(true)}>
                        <Search className="w-4 h-4 mr-2" /> Search in Chat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleClearClick} disabled={clearing}>
                        <Trash2 className="w-4 h-4 mr-2" /> {clearing ? "Clearing..." : "Clear Chat"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Dialog */}
            <Dialog open={openSearch} onOpenChange={setOpenSearch}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Search in Chat</DialogTitle>
                        <DialogDescription>
                            Cari kata kunci dalam percakapan ini
                        </DialogDescription>
                    </DialogHeader>

                    <Input
                        placeholder="Masukkan kata kunci..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
