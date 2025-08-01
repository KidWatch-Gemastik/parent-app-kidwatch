"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    ChevronDown,
    Rocket,
    Settings2,
    User,
    Filter,
    Bolt,
    ExternalLink,
    LogIn,
    LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useSupabaseAuthSession } from "@/hooks/useSupabaseAuthSession"
import Image from "next/image"

export default function UserProfileDropdown() {
    const { user } = useSupabaseAuthSession()
    const router = useRouter()

    const name = user?.user_metadata.full_name || user?.user_metadata.name || "User"
    const avatar = user?.user_metadata.avatar_url
    const email = user?.email || "user@example.com"

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.replace("/login")
    }

    console.log(avatar)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 px-3 py-1 rounded-lg hover:bg-emerald-500/10 text-gray-200 hover:text-emerald-400 transition">
                <Avatar>
                    {avatar ? (
                        <Image src={avatar} alt={name} width={32} height={32} />
                    ) : (
                        <AvatarFallback className="bg-emerald-500 text-white">{email[0]}</AvatarFallback>
                    )}
                </Avatar>
                <div className="hidden md:flex flex-col text-start">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">{email}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-2 w-72 bg-gray-900 border border-emerald-500/20 text-gray-100 backdrop-blur-xl">
                <DropdownMenuItem className="py-3">
                    <Avatar>
                        {avatar ? (
                            <Image src={avatar} alt={name} width={32} height={32} />
                        ) : (
                            <AvatarFallback className="bg-emerald-500 text-white">{email[0]}</AvatarFallback>
                        )}
                    </Avatar>
                    <div className="ml-2 flex flex-col">
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex-col items-start gap-1">
                    <div className="flex items-center gap-1">
                        <Rocket className="h-4 w-4" />
                        <span className="font-medium leading-none">Upgrade Plan</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Kamu Sedang Menggunakan Free Tier.</p>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Invite People
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.replace('/preferences')}>
                    <Settings2 className="mr-2 h-4 w-4" />
                    Preferences
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Filter className="mr-2 h-4 w-4" />
                        Filter View
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Activity</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Unread only</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Mentions only</DropdownMenuCheckboxItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>People</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuCheckboxItem checked>Everyone</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Only internal</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>With guests</DropdownMenuCheckboxItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Bolt className="mr-2 h-4 w-4" />
                        Tools & Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-56">
                        <DropdownMenuLabel>Tools</DropdownMenuLabel>
                        <DropdownMenuItem>Customize Workspace</DropdownMenuItem>
                        <DropdownMenuItem>Analytics <ExternalLink className="ml-auto h-3 w-3" /></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Admin</DropdownMenuLabel>
                        <DropdownMenuItem>Manage Integrations</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in on mobile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
