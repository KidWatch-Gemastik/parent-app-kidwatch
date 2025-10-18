"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Circle,
} from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ruler } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";

interface MapPickerProps {
  onSelectLocation: (lat: number, lng: number, radius: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialRadius?: number;
  label?: string;
}

const defaultCenter = { lat: -8.65, lng: 115.216667 };

/**
 * Komponen marker untuk menangkap event klik pada peta.
 */
function LocationMarker({
  setLatitude,
  setLongitude,
  setRadius,
  onSelectLocation,
}: {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  setRadius: (r: number) => void;
  onSelectLocation: (lat: number, lng: number, r: number) => void;
}) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setLatitude(lat);
      setLongitude(lng);
      onSelectLocation(lat, lng, 100);
      toast.success("Lokasi dipilih dari peta.");
    },
  });

  return null;
}

export function MapPicker({
  onSelectLocation,
  initialLatitude,
  initialLongitude,
  initialRadius,
  label = "Pilih Lokasi di Peta",
}: MapPickerProps) {
  const [latitude, setLatitude] = React.useState(
    initialLatitude ?? defaultCenter.lat
  );
  const [longitude, setLongitude] = React.useState(
    initialLongitude ?? defaultCenter.lng
  );
  const [radius, setRadius] = React.useState(initialRadius ?? 100);
  const mapRef = React.useRef<L.Map | null>(null);

  // Debounce agar tidak terjadi banyak update saat mengetik radius
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   * Mengambil lokasi pengguna saat komponen pertama kali dimuat.
   */
  React.useEffect(() => {
    if (
      !initialLatitude &&
      !initialLongitude &&
      typeof window !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          onSelectLocation(lat, lng, radius);

          // Pusatkan peta ke lokasi pengguna
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16);
          }

          toast.success("Lokasi pengguna berhasil ditemukan.");
        },
        (err) => {
          console.warn("Gagal mengambil lokasi pengguna:", err);
          toast.error("Tidak dapat mendeteksi lokasi perangkat.");
          onSelectLocation(latitude, longitude, radius);
        }
      );
    } else {
      onSelectLocation(latitude, longitude, radius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Mengupdate lokasi secara realtime ketika user mengubah nilai latitude/longitude secara manual.
   * Bisa dikembangkan untuk text input lokasi.
   */
  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSelectLocation(latitude, longitude, radius);
    }, 400);
  }, [latitude, longitude, radius, onSelectLocation]);

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="h-[300px] rounded-lg overflow-hidden relative z-0">
          <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            scrollWheelZoom
            className="h-full w-full z-0"
            ref={(ref) => {
              if (ref) mapRef.current = ref;
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setRadius={setRadius}
              onSelectLocation={onSelectLocation}
            />
            <Marker
              position={[latitude, longitude]}
              icon={L.icon({
                iconUrl: "/marker.png",
                iconSize: [25, 25],
                iconAnchor: [12, 41],
              })}
            />
            <Circle
              center={[latitude, longitude]}
              radius={radius}
              pathOptions={{ color: "#10B981" }}
            />
          </MapContainer>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span>Radius:</span>
          <Input
            type="number"
            min={10}
            max={1000}
            value={radius}
            onChange={(e) => {
              const r = Number(e.target.value);
              setRadius(r);
              if (mapRef.current) {
                mapRef.current.setView([latitude, longitude]);
              }
            }}
            className="w-24 text-black"
          />
          <Ruler className="w-4 h-4 text-purple-400" />
          <span>{radius} meter</span>
        </div>
      </CardContent>
    </Card>
  );
}
