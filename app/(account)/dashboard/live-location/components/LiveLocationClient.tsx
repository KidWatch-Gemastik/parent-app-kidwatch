"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, ArrowLeft, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/providers/SupabaseProvider";

// Dynamic imports untuk leaflet agar SSR aman
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function LiveLocationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("id");
  const { supabase } = useSupabase();

  const [location, setLocation] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!childId) return;

    const fetchInitial = async () => {
      const { data: childData } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .single();

      const { data: locData } = await supabase
        .from("locations")
        .select("*")
        .eq("child_id", childId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setChild(childData);
      if (locData) setLocation({ ...locData });
    };

    fetchInitial(); // panggil fungsi async tanpa menandai useEffect async

    const channel = supabase
      .channel(`realtime-location-${childId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "locations",
          filter: `child_id=eq.${childId}`,
        },
        (payload) => setLocation(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [childId, supabase]);

  if (!location || !child) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <Shield className="w-10 h-10 text-emerald-400 mb-3 animate-pulse" />
        <p>Memuat lokasi anak...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Tombol back */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          onClick={() => router.back()}
          variant="secondary"
          className="bg-gray-900/70 text-white hover:bg-gray-800 border border-gray-700"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
        </Button>
      </div>

      {/* Informasi Anak */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Card className="bg-gray-900/80 p-3 text-white backdrop-blur-xl border-emerald-500/30">
          <div className="flex items-center gap-3">
            <img
              src={
                child.avatar ||
                `https://api.dicebear.com/6.x/avataaars/svg?seed=${child.name}`
              }
              alt={child.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{child.name}</p>
              <p className="text-xs text-gray-400">📍 {location.address}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Realtime */}
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={16}
        style={{ height: "100vh", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker
          position={[location.latitude, location.longitude]}
          ref={markerRef}
        >
          <Popup>
            <div className="text-sm">
              <strong>{child.name}</strong>
              <br />
              {location.address || "Lokasi tidak diketahui"}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Bottom Floating Info */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%]">
        <div className="bg-gray-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 text-center text-white shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span className="text-sm">{location.address}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Terakhir update:{" "}
            {new Date(location.timestamp || "").toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
