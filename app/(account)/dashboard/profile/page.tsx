"use client"

import { useState, useEffect, JSX } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Globe, Edit2, Check, User, Users, Eye } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSupabase } from "@/providers/SupabaseProvider"
import { QRCodeCanvas } from "qrcode.react"
import Image from "next/image"
import { toast } from "sonner"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"

interface ParentProfile {
    id: string;
    email: string;
    banned_until?: string | null;
    created_at: string;
    confirmed_at?: string | null;
    last_sign_in_at?: string | null;
    updated_at?: string;
    raw_app_meta_data?: {
        provider?: string;
        providers?: string[];
    };
    raw_user_meta_data: {
        iss?: string;
        sub?: string;
        name?: string;
        full_name?: string;
        picture?: string;
        phone?: string | null;
        avatar_url?: string;
        provider_id?: string;
        email_verified?: boolean;
        phone_verified?: boolean;
        social_link?: string;
    };
    children_count?: number;
}



const providerIcons: Record<string, JSX.Element> = {
    email: <Mail className="h-4 w-4" />,
    google: <Image src="/google-icon.svg" alt="Google" width={16} height={16} />,
}

export default function ParentProfilePage() {
    const { supabase, session } = useSupabase()
    const userId = session?.user.id || null

    const [profile, setProfile] = useState<ParentProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [updating, setUpdating] = useState(false)

    // Fetch user profile from Supabase
    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);

            try {
                // Ambil data user dari Supabase Auth
                const { data, error } = await supabase.auth.getUser();
                if (error || !data?.user) {
                    console.error("Error fetching user:", error);
                    setLoading(false);
                    return;
                }

                const user = data.user;

                // Ambil jumlah anak dari tabel custom "children"
                const { count: childrenCount } = await supabase
                    .from("children")
                    .select("*", { count: "exact" })
                    .eq("parent_id", user.id);

                // Set profile state
                setProfile({
                    id: user.id,
                    email: user.email!,
                    banned_until: (user as any).banned_until || null,
                    created_at: user.created_at,
                    confirmed_at: user.confirmed_at,
                    last_sign_in_at: user.last_sign_in_at,
                    updated_at: user.updated_at,
                    raw_app_meta_data: user.app_metadata,
                    raw_user_meta_data: {
                        name: user.user_metadata?.name,
                        full_name: user.user_metadata?.full_name,
                        picture: user.user_metadata?.picture,
                        avatar_url: user.user_metadata?.avatar_url,
                        social_link: user.user_metadata?.social_link,
                        email_verified: user.user_metadata?.email_verified,
                        phone_verified: user.user_metadata?.phone_verified,
                        provider_id: user.user_metadata?.provider_id,
                        iss: user.user_metadata?.iss,
                        phone: user.user_metadata?.phone,
                        sub: user.user_metadata?.sub,
                    },
                    children_count: childrenCount || 0,
                });
            } catch (err) {
                console.error("Fetch profile error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, supabase]);



    const handleSave = async () => {
        if (!profile) return
        setUpdating(true)

        try {
            let formattedPhone = profile.raw_user_meta_data.phone || ""
            if (formattedPhone && !formattedPhone.startsWith("+62")) {
                formattedPhone = `+62${formattedPhone.replace(/^0/, "")}`
            }

            const { error } = await supabase.auth.updateUser({
                data: {
                    user_metadata: {
                        ...profile.raw_user_meta_data,
                        phone: formattedPhone,
                    },
                },
            })

            if (error) {
                console.error("Update error:", error)
                toast.error("Gagal menyimpan nomor telepon")
            } else {
                setProfile((prev) =>
                    prev
                        ? {
                            ...prev,
                            phone: formattedPhone,
                            raw_user_meta_data: { ...prev.raw_user_meta_data, phone: formattedPhone },
                        }
                        : prev,
                )
                toast.success("Nomor telepon berhasil disimpan!")
            }
        } catch (err) {
            console.error("Unexpected error:", err)
            toast.error("Terjadi kesalahan saat menyimpan")
        } finally {
            setEditMode(false)
            setUpdating(false)
        }
    }


    const handleEditToggle = () => {
        if (editMode && !updating) {
            handleSave()
        } else {
            setEditMode(!editMode)
        }
    }

    if (!session) {
        return <div className="flex items-center justify-center min-h-screen text-white">Memuat...</div>
    }

    // console.log(profile)

    return (
        <>

            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="relative z-10 flex">
                    <DashboardSidebar />
                    <main className="flex-1 p-6 space-y-8 w-full">

                        <div className="container mx-auto px-4 py-8 max-w-7xl">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-foreground mb-2">Profil Parent</h1>
                                <p className="text-muted-foreground">Kelola informasi akun dan data pribadi Anda</p>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-3">
                                <Card className="lg:col-span-2">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-wrap items-center gap-4">
                                                {loading ? (
                                                    <Skeleton className="h-20 w-20 rounded-full" />
                                                ) : (
                                                    <Avatar className="h-20 w-20 ring-2 ring-primary/10">
                                                        <AvatarImage
                                                            src={profile?.raw_user_meta_data.avatar_url || profile?.raw_user_meta_data.picture}
                                                            alt={profile?.raw_user_meta_data.full_name || "User"}
                                                        />
                                                        <AvatarFallback className="text-lg font-semibold">
                                                            {profile?.raw_user_meta_data.full_name?.[0] || profile?.raw_user_meta_data.name?.[0] || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}

                                                <div className="space-y-1">
                                                    {loading ? (
                                                        <Skeleton className="h-7 w-32" />
                                                    ) : (
                                                        <h2 className="text-2xl font-bold text-foreground">
                                                            {profile?.raw_user_meta_data.full_name || profile?.raw_user_meta_data.name || "Guest"}
                                                        </h2>
                                                    )}

                                                    {!loading && (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                <Users className="h-3 w-3 mr-1" />
                                                                {profile?.children_count || 0} Anak
                                                            </Badge>
                                                            {profile?.raw_user_meta_data.email_verified && (
                                                                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                                                    Terverifikasi
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {editMode && (
                                                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)} disabled={updating}>
                                                        Cancel
                                                    </Button>
                                                )}

                                                <Button
                                                    variant={editMode ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={handleEditToggle}
                                                    disabled={updating}
                                                >
                                                    {updating ? (
                                                        "Menyimpan..."
                                                    ) : editMode ? (
                                                        <>
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Simpan
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Edit2 className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <Separator />

                                        <div className="grid gap-6">
                                            {/* Email */}
                                            <div className="grid gap-2">
                                                <Label className="text-sm font-medium flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    Email
                                                </Label>
                                                {loading ? (
                                                    <Skeleton className="h-10 w-full" />
                                                ) : (
                                                    <div className="px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
                                                        {profile?.email}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Phone */}
                                            <div className="grid gap-2">
                                                <Label className="text-sm font-medium flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    Nomor Telepon
                                                </Label>
                                                {loading ? (
                                                    <Skeleton className="h-10 w-full" />
                                                ) : editMode ? (
                                                    <Input
                                                        value={profile?.raw_user_meta_data.phone || ""}
                                                        onChange={(e) =>
                                                            setProfile((prev) =>
                                                                prev
                                                                    ? {
                                                                        ...prev,
                                                                        raw_user_meta_data: {
                                                                            ...prev.raw_user_meta_data,
                                                                            phone: e.target.value,
                                                                        },
                                                                    }
                                                                    : null
                                                            )
                                                        }
                                                        placeholder="Masukkan nomor telepon"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md text-sm">
                                                        <span>
                                                            {profile?.raw_user_meta_data.phone
                                                                ? profile.raw_user_meta_data.phone.startsWith("+62")
                                                                    ? profile.raw_user_meta_data.phone
                                                                    : `+62${profile.raw_user_meta_data.phone.replace(/^0/, "")}`
                                                                : "Belum diatur"}
                                                        </span>
                                                        {profile?.raw_user_meta_data.phone && (
                                                            <Button
                                                                variant="outline"
                                                                size="xs"
                                                                onClick={() => {
                                                                    const phone = profile.raw_user_meta_data.phone
                                                                        ? profile.raw_user_meta_data.phone.startsWith("+62")
                                                                            ? profile.raw_user_meta_data.phone
                                                                            : `+62${profile.raw_user_meta_data.phone.replace(/^0/, "")}`
                                                                        : "";

                                                                    if (phone) {
                                                                        navigator.clipboard.writeText(phone);
                                                                        toast.success("Nomor telepon berhasil dicopy!");
                                                                    } else {
                                                                        toast.error("Nomor telepon tidak tersedia");
                                                                    }
                                                                }}
                                                            >
                                                                Copy
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>



                                            <div className="grid gap-2">
                                                <Label className="text-sm font-medium flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    Anda Login Dengan
                                                </Label>
                                                {loading ? (
                                                    <Skeleton className="h-10 w-full" />
                                                ) : (
                                                    <div className="flex gap-2 px-3 py-2 bg-muted/50 rounded-md text-sm">
                                                        {profile?.raw_app_meta_data?.providers?.map((provider) => (
                                                            <div key={provider} className="flex items-center gap-1">
                                                                {providerIcons[provider] || null}
                                                                <span className="capitalize">{provider}</span>
                                                            </div>
                                                        )) || "Belum ada provider"}
                                                    </div>
                                                )}
                                            </div>


                                        </div >
                                    </CardContent >
                                </Card >

                                {/* Sidebar Info */}
                                < div className="space-y-6" >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Informasi Akun
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Bergabung Sejak</Label>
                                                {loading ? (
                                                    <Skeleton className="h-5 w-full mt-1" />
                                                ) : (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {new Date(profile?.created_at || "").toLocaleDateString("id-ID", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>


                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Terakhir Di lihat</Label>
                                                {loading ? (
                                                    <Skeleton className="h-5 w-full mt-1" />
                                                ) : (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {new Date(profile?.last_sign_in_at || "").toLocaleDateString("id-ID", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <Separator />

                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">ID Pengguna</Label>
                                                {loading ? (
                                                    <Skeleton className="h-5 w-full mt-1" />
                                                ) : (
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {/* QR Code */}
                                                        <QRCodeCanvas value={profile?.id || ""} size={200} />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Statistik</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-primary">{profile?.children_count || 0}</div>
                                                <div className="text-sm text-muted-foreground">Anak Terdaftar</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div >
                            </div >
                        </div >
                    </main>
                </div >
            </div >

        </>
    )
}
