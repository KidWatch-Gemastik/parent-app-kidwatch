"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ruler, Search, LocateFixed } from "lucide-react";
import { toast } from "sonner";

interface MapPickerProps {
  onSelectLocation: (lat: number, lng: number, radius: number) => void;
  initialRadius?: number;
  label?: string;
}

const fallbackCenter = { lat: -6.1754, lng: 106.8272 }; // fallback Jakarta

// === Marker Klik Lokasi di Map ===
function LocationMarker({
  setLatitude,
  setLongitude,
  onSelectLocation,
}: {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  onSelectLocation: (lat: number, lng: number, r: number) => void;
}) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setLatitude(lat);
      setLongitude(lng);
      onSelectLocation(lat, lng, 100);
    },
  });
  return null;
}

export function MapPicker({
  onSelectLocation,
  initialRadius = 100,
  label = "Pilih Lokasi di Peta",
}: MapPickerProps) {
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [radius, setRadius] = React.useState(initialRadius);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const mapRef = React.useRef<L.Map | null>(null);

  // === Ambil lokasi perangkat secara langsung ===
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          onSelectLocation(lat, lng, radius);
          mapRef.current?.setView([lat, lng], 16);
          toast.success("Lokasi perangkat ditemukan");
        },
        (err) => {
          console.warn("Gagal ambil lokasi perangkat:", err);
          toast.error(
            "Gagal mengambil lokasi perangkat, gunakan lokasi default"
          );
          setLatitude(fallbackCenter.lat);
          setLongitude(fallbackCenter.lng);
          onSelectLocation(fallbackCenter.lat, fallbackCenter.lng, radius);
        }
      );
    } else {
      toast.error("Geolocation tidak didukung perangkat");
      setLatitude(fallbackCenter.lat);
      setLongitude(fallbackCenter.lng);
      onSelectLocation(fallbackCenter.lat, fallbackCenter.lng, radius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Search lokasi (pakai OpenStreetMap Nominatim) ===
  React.useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Gagal mencari lokasi:", err);
        toast.error("Gagal mencari lokasi, coba lagi.");
      } finally {
        setIsSearching(false);
      }
    }, 600); // debounce 600ms

    return () => clearTimeout(timeout);
  }, [query]);

  // === Pilih lokasi dari hasil search ===
  const handleSelectResult = (r: any) => {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    setLatitude(lat);
    setLongitude(lon);
    onSelectLocation(lat, lon, radius);
    mapRef.current?.setView([lat, lon], 16);
    setResults([]);
    setQuery(r.display_name);
  };

  // === Refresh lokasi perangkat ===
  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          onSelectLocation(lat, lng, radius);
          mapRef.current?.setView([lat, lng], 16);
          toast.success("Lokasi perangkat diperbarui");
        },
        () => toast.error("Gagal memperbarui lokasi perangkat")
      );
    }
  };

  if (latitude === null || longitude === null) {
    return (
      <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg p-6 text-center">
        <p>Mendeteksi lokasi perangkat...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4">
        {/* === Search Input === */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari lokasi (contoh: SD N 7 Batubulan)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-black"
            />
            <button
              onClick={handleRefreshLocation}
              title="Perbarui lokasi perangkat"
              className="p-2 rounded-lg hover:bg-gray-700 transition"
            >
              <LocateFixed className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* Dropdown hasil pencarian */}
          {results.length > 0 && (
            <ul className="absolute z-50 mt-2 w-full bg-white text-black rounded-lg shadow-md max-h-48 overflow-auto">
              {results.map((r, i) => (
                <li
                  key={i}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-sm"
                  onClick={() => handleSelectResult(r)}
                >
                  {r.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* === Peta === */}
        <div className="h-[300px] rounded-lg overflow-hidden relative z-0">
          <MapContainer
            center={[latitude, longitude]}
            zoom={16}
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

        {/* === Radius === */}
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
              onSelectLocation(latitude, longitude, r);
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
