"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  PhoneCall,
  ShieldCheck,
  BarChart3,
  Bell,
  Smartphone,
  AlertTriangle,
  Eye,
  Sparkles,
  Plus,
  Shield,
  Gpu,
  GpuIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";

import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import DashboardCard from "@/components/layouts/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChildren } from "@/hooks/useChildren";
import { useChildDetails } from "@/hooks/useChildDashboard";
import type { Child } from "@/types";
import { cn } from "@/lib/utils";
import { getAgeFromDate } from "@/lib/function";
import { useSupabase } from "@/providers/SupabaseProvider";
import Image from "next/image";

// Lazy load MapPopup
const MapPopup = dynamic(() => import("@/components/maps/MapPopup"), {
  ssr: false,
});

export default function DashboardPage() {
  const router = useRouter();
  const { session } = useSupabase();
  const user = session?.user ?? null;

  // === Hooks ===
  const { children: fetchedChildren, isLoading: loadingChildren } = useChildren(
    user?.id || null
  );
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [address, setAddress] = useState<string>("Memuat alamat...");

  // Tentukan currentChild agar tidak membuat hook conditional
  const currentChild = selectedChild || fetchedChildren[0] || null;

  // Hook useChildDetails harus selalu terpanggil
  const { details, loading: loadingDetails } = useChildDetails(
    currentChild?.id || ""
  );

  // === Redirect jika belum login ===
  useEffect(() => {
    if (!user && !loadingChildren) router.replace("/login");
  }, [user, loadingChildren, router]);

  // === Set default anak ===
  useEffect(() => {
    if (!loadingChildren && fetchedChildren.length > 0 && !selectedChild) {
      setSelectedChild(fetchedChildren[0]);
    }
  }, [fetchedChildren, loadingChildren, selectedChild]);

  // === Fetch alamat dari lat/lng ===
  const latitude = details?.locations?.[0]?.latitude ?? 0;
  const longitude = details?.locations?.[0]?.longitude ?? 0;

  useEffect(() => {
    async function fetchAddress() {
      if (!latitude || !longitude) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setAddress(data?.display_name || "Alamat tidak ditemukan");
      } catch (err) {
        console.error("Gagal mengambil alamat:", err);
        setAddress("Gagal memuat alamat");
      }
    }
    fetchAddress();
  }, [latitude, longitude]);

  // === Loading UI ===
  const isLoading = !user || loadingChildren || loadingDetails;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            {/* <Shield className="w-8 h-8 text-white" /> */}
             <Image
                                src={"/logo/KiddyGo-Logo.png"}
                                className="w-32"
                                loading="eager"
                                alt="KiddyGoo Logo Icon"
                                width={100}
                                height={100}
                              />
          </div>
          <p className="text-emerald-400 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // === Jika belum ada anak ===
  if (!fetchedChildren.length) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col bg-slate-950 text-white">
        <p className="text-gray-400 mb-4">Tidak ada anak terdaftar.</p>
        <Button
          onClick={() => router.push("/children")}
          className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white"
        >
          <Plus className="mr-2 w-4 h-4" /> Tambah Anak
        </Button>
      </div>
    );
  }

  // === Data Details ===
  const stats = details?.stats ?? {
    totalCalls: 0,
    totalMessages: 0,
    totalZones: 0,
    activeDevices: 0,
  };
  const onlineStatus = details?.devices?.some((d) => d.is_online)
    ? "Online"
    : "Offline";
  const recentActivities = details?.appUsages?.slice(0, 5) ?? [];

  const alerts = [
    ...(stats.totalZones === 0
      ? [
          {
            type: "warning",
            message: "Belum ada zona aman dibuat",
            time: "Baru saja",
          },
        ]
      : []),
    ...(onlineStatus === "Offline"
      ? [
          {
            type: "error",
            message: "Perangkat sedang offline",
            time: "Baru saja",
          },
        ]
      : []),
  ];

  const featureCards = [
    {
      title: "Location Tracking",
      description: "Monitor lokasi real-time anak Anda.",
      action: "View Map",
      icon: <MapPin className="h-4 w-4 text-white" />,
      href: "/dashboard/location",
    },
    {
      title: "Call & Message Logs",
      description: "Lihat panggilan dan pesan anak Anda.",
      action: "View Logs",
      icon: <PhoneCall className="h-4 w-4 text-white" />,
      href: "/dashboard/logs",
    },
    {
      title: "Safe Zones",
      description: "Atur zona aman dan geofencing.",
      action: "Manage Zones",
      icon: <ShieldCheck className="h-4 w-4 text-white" />,
      href: "/dashboard/safe-zones",
    },
    {
      title: "Usage Stats",
      description: "Lihat statistik penggunaan aplikasi.",
      action: "View Report",
      icon: <BarChart3 className="h-4 w-4 text-white" />,
      href: "/dashboard/stats",
    },
  ];

  // === Render UI ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950">
      <div className="flex relative z-10">
        <DashboardSidebar />
        <main className="flex-1 p-6 space-y-8">
          <DashboardHeader
            title="Dashboard"
            description="Ringkasan aktivitas dan kontrol anak Anda"
          />

          {/* Pilih Anak */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Pilih Anak
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {fetchedChildren.map((child) => (
                <Card
                  key={child.id}
                  className={cn(
                    "cursor-pointer border bg-gray-900/80 backdrop-blur-xl flex-shrink-0 transition-all",
                    selectedChild?.id === child.id
                      ? "ring-2 ring-emerald-500 bg-emerald-950/40"
                      : "border-gray-700 hover:border-emerald-500/40"
                  )}
                  onClick={() => setSelectedChild(child)}
                >
                  <CardContent className="p-5 flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          child.avatar ||
                          `https://api.dicebear.com/6.x/avataaars/svg?seed=${child.name}`
                        }
                      />
                      <AvatarFallback>{child.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-semibold">{child.name}</h3>
                      <p className="text-sm text-gray-400">
                        Usia {getAgeFromDate(child.date_of_birth)} tahun
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Alerts */}
          {alerts.length > 0 && (
            <section className="space-y-3">
              {alerts.map((alert, i) => (
                <Card
                  key={i}
                  className="border-l-4 border-amber-500 bg-amber-950/30 backdrop-blur-xl"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="text-amber-400 h-5 w-5" />
                      <span className="text-amber-100 text-sm font-medium">
                        {alert.message}
                      </span>
                    </div>
                    <span className="text-xs text-amber-300">{alert.time}</span>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

          {/* Statistik */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OverviewCard
              title="Total Calls"
              value={stats.totalCalls}
              icon={<PhoneCall />}
            />
            <OverviewCard
              title="Total Messages"
              value={stats.totalMessages}
              icon={<Bell />}
            />
            <OverviewCard
              title="Active Devices"
              value={stats.activeDevices}
              icon={<Smartphone />}
            />
            <OverviewCard
              title="Safe Zones"
              value={stats.totalZones}
              icon={<ShieldCheck />}
            />
          </section>

          {/* Aktivitas Terbaru + Kontrol */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-gray-900/80 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-emerald-400" /> Aktivitas Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.length ? (
                    recentActivities.map((a, i) => {
                      // Pastikan format tanggal valid ISO
                      const validDate = a.timestamp
                        ? new Date(
                            a.timestamp.includes("Z")
                              ? a.timestamp
                              : a.timestamp + "Z"
                          )
                        : null;

                      const formattedTime = validDate
                        ? validDate.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "(Tidak di Set)";

                      const formattedDate = validDate
                        ? validDate.toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Tidak ada Tanggal";

                      return (
                        <div
                          key={i}
                          className="flex justify-between p-3 bg-gray-800/60 rounded-lg border border-gray-700/50"
                        >
                          <div className="text-sm text-gray-300">
                            <span className="text-emerald-400 font-semibold">
                              {formattedTime}
                            </span>{" "}
                            — {a.app_name}
                            <div className="text-xs text-gray-500 mt-1">
                              {formattedDate}
                            </div>
                          </div>
                          <Badge
                            className={
                              a.is_blocked
                                ? "bg-red-500/20 text-red-400"
                                : "bg-emerald-500/20 text-emerald-400"
                            }
                          >
                            {a.is_blocked ? "blocked" : "allowed"}
                          </Badge>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Belum ada aktivitas hari ini.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-white">Quick Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Tombol Lihat Lokasi */}
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => setShowMap(true)}
                >
                  <MapPin className="w-4 h-4 mr-2" /> Lihat Lokasi
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => {
                    if (!selectedChild?.id) return;
                    const uniqueId = uuidv4(); 
                    router.push(
                      `/dashboard/live-location?id=${selectedChild.id}&uid=${uniqueId}`
                    );
                  }}
                >
                  <GpuIcon className="w-4 h-4 mr-2" /> Akses Lokasi Anak
                  Realtime
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Fitur Tambahan */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </section>

          {/* Map Popup */}
          {showMap && (
            <MapPopup
              lat={latitude}
              lng={longitude}
              address={address}
              onClose={() => setShowMap(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-gray-900/80 border-emerald-500/30 hover:scale-105 transition-all">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm text-gray-400">{title}</CardTitle>
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center text-white">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
