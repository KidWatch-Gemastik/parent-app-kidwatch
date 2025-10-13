"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MapPin,
  ArrowLeft,
  Shield,
  Crosshair,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/providers/SupabaseProvider";
import dynamic from "next/dynamic";

// Dynamic import React-Leaflet components (SSR safe)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), {
  ssr: false,
});
const ZoomControl = dynamic(
  () => import("react-leaflet").then((m) => m.ZoomControl),
  { ssr: false }
);
const ScaleControl = dynamic(
  () => import("react-leaflet").then((m) => m.ScaleControl),
  { ssr: false }
);
import { useMap } from "react-leaflet";

// Hook untuk mendapatkan map instance
function MapReady({ onReady }: { onReady: (map: any) => void }) {
  const map = useMap();
  useEffect(() => {
    if (map) onReady(map);
  }, [map, onReady]);
  return null;
}

export default function LiveLocationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("id");
  const { supabase } = useSupabase();

  const [location, setLocation] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const [address, setAddress] = useState<string>("Memuat alamat...");
  const [map, setMap] = useState<any>(null);
  const markerRef = useRef<any>(null);
  const [L, setLeaflet] = useState<any>(null);

  // Load Leaflet hanya di client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => setLeaflet(L));
    }
  }, []);

  // Fetch child dan lokasi terakhir + realtime updates
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
      if (locData) setLocation(locData);
      if (locData) reverseGeocode(locData.latitude, locData.longitude);
    };

    fetchInitial();

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
        (payload) => {
          setLocation(payload.new);
          reverseGeocode(payload.new.latitude, payload.new.longitude);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [childId, supabase]);

  // Reverse geocode via OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddress(data.display_name || "Alamat tidak ditemukan");
    } catch {
      setAddress("Alamat tidak ditemukan");
    }
  };

  // Fly to new location
  useEffect(() => {
    if (!map || !location) return;
    map.flyTo([location.latitude, location.longitude], map.getZoom(), {
      duration: 0.75,
    });
  }, [map, location]);

  const recenter = () => {
    if (!map || !location) return;
    map.flyTo(
      [location.latitude, location.longitude],
      Math.max(map.getZoom(), 16),
      { duration: 0.5 }
    );
  };

  const openInGoogleMaps = () => {
    if (!location) return;
    window.open(
      `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      "_blank"
    );
  };

  const copyCoords = async () => {
    if (!location) return;
    try {
      await navigator.clipboard.writeText(
        `${location.latitude}, ${location.longitude}`
      );
    } catch {}
  };

  // Custom child icon
  const childIcon = useMemo(() => {
    if (!L || !child) return null; // pastikan L dan child sudah tersedia
    const avatarUrl =
      child.avatar ||
      `https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(
        child.name || "anon"
      )}`;
    const html = `
    <div style="position: relative; width: 56px; height: 62px;">
      <div style="
        width: 48px; height: 48px; border-radius: 9999px; border: 2px solid var(--primary);
        background-image: url('${avatarUrl}'); background-size: cover; background-position: center; margin: 0 auto;
      "></div>
      <div style="
        position: absolute; left: 50%; bottom: 0px; width: 12px; height: 12px;
        background: var(--primary); transform: translateX(-50%) rotate(45deg); border-radius: 2px;
      "></div>
    </div>
  `;
    return L.divIcon({
      html,
      className: "",
      iconSize: [56, 62],
      iconAnchor: [28, 60],
      popupAnchor: [0, -56],
    });
  }, [child, L]);

  if (!location || !child || !L)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Shield className="animate-pulse w-10 h-10 text-primary" />
        <p>Memuat lokasi...</p>
      </div>
    );

  const lat = location.latitude;
  const lng = location.longitude;
  const accuracy =
    typeof location.accuracy === "number" ? location.accuracy : 30;
  const lastUpdated =
    location.created_at || location.timestamp || location.updated_at || "";

  return (
    <div className="relative h-screen w-full">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-[1000] flex items-start justify-between p-4">
        <Button onClick={() => router.back()} variant="secondary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <Card>
          <div className="flex items-center gap-3 p-2">
            <img
              src={
                child.avatar ||
                `https://api.dicebear.com/6.x/avataaars/svg?seed=${
                  child.name || "anon"
                }`
              }
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{child.name}</p>
              <p className="text-xs text-muted-foreground">{address}</p>
            </div>
          </div>
        </Card>
      </header>

      {/* Map */}
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        zoomControl={false}
        className="absolute inset-0 h-full w-full"
      >
        <MapReady onReady={setMap} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Circle
          center={[lat, lng]}
          radius={accuracy}
          pathOptions={{
            color: "var(--primary)",
            fillColor: "var(--primary)",
            fillOpacity: 0.12,
            opacity: 0.4,
          }}
        />
        <Marker position={[lat, lng]} icon={childIcon} ref={markerRef}>
          <Popup>
            <strong>{child.name}</strong>
            <div className="text-xs">{address}</div>
          </Popup>
        </Marker>
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" />
      </MapContainer>

      {/* Bottom info panel */}
      <div className="absolute inset-x-0 bottom-0 z-[1000] p-4">
        <div className="mx-auto w-full max-w-2xl rounded-2xl border bg-card/90 p-4 shadow-xl backdrop-blur">
          <div className="flex justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-sm font-medium">Lokasi Saat Ini</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{address}</p>
              <div className="mt-2 flex gap-2 text-sm">
                <div className="rounded-lg border p-2">
                  <p className="text-[11px] uppercase text-muted-foreground">
                    Koordinat
                  </p>
                  <p className="mt-1 font-medium">
                    {lat.toFixed(5)}, {lng.toFixed(5)}
                  </p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-[11px] uppercase text-muted-foreground">
                    Akurasi
                  </p>
                  <p className="mt-1 font-medium">{accuracy} m</p>
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Terakhir update:{" "}
                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "—"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={recenter}>
                <Crosshair className="mr-2 h-4 w-4" /> Pusatkan
              </Button>
              <Button onClick={openInGoogleMaps}>
                <ExternalLink className="mr-2 h-4 w-4" /> Buka di Maps
              </Button>
              <Button variant="secondary" onClick={copyCoords}>
                Salin Koordinat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
