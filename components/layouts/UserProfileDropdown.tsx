"use client";

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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    HelpCircle,
    BabyIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useSupabaseAuthSession } from "@/hooks/useSupabaseAuthSession";
import Image from "next/image";
import Link from "next/link";

export default function UserProfileDropdown() {
    const { user } = useSupabaseAuthSession();
    const { supabase } = useSupabase();
    const router = useRouter();

    const name =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        "Guest User";
    const avatar = user?.user_metadata?.avatar_url;
    const email = user?.email || "guest@example.com";

    const handleLogout = async () => {
        localStorage.removeItem("kidy-goo-auth");
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                key={user?.id ?? "guest"}
                className="flex items-center gap-3 px-3 py-1 rounded-lg hover:bg-emerald-500/10 text-gray-200 hover:text-emerald-400 transition"
            >
                <Avatar>
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={name}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    ) : (
                        <AvatarFallback className="bg-emerald-500 text-white">
                            {email[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="hidden md:flex flex-col text-start">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">{email}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-2 w-72 bg-gray-900 border border-emerald-500/20 text-gray-100 backdrop-blur-xl">
                {user ? (
                    <>
                        {/* Profil Header */}
                        <DropdownMenuItem className="py-3">
                            <Avatar>
                                {avatar ? (
                                    <Image
                                        src={avatar}
                                        alt={name}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-emerald-500 text-white">
                                        {email[0]?.toUpperCase() ?? "U"}
                                    </AvatarFallback>
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
                            <p className="text-xs text-muted-foreground">
                                Kamu Sedang Menggunakan Free Tier.
                            </p>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => router.push("/dashboard/perangkat")}>
                            <BabyIcon className="mr-2 h-4 w-4" />
                            Add Child
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => router.push("/dashboard/preferences")}>
                            <Settings2 className="mr-2 h-4 w-4" />
                            Preferences
                        </DropdownMenuItem>


                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Help
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuLabel>Guest</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/login")}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/register")}>
                            <User className="mr-2 h-4 w-4" />
                            Register
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu >
    );
}
