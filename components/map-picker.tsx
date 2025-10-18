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
import { Ruler, Search } from "lucide-react";
import L from "leaflet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MapPickerProps {
  onSelectLocation: (lat: number, lng: number, radius: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialRadius?: number;
  label?: string;
}

const defaultCenter = { lat: -8.65, lng: 115.216667 };

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
    },
  });
  return null;
}

export function MapPicker({
  onSelectLocation,
  initialLatitude,
  initialLongitude,
  initialRadius,
}: MapPickerProps) {
  const [latitude, setLatitude] = React.useState(
    initialLatitude ?? defaultCenter.lat
  );
  const [longitude, setLongitude] = React.useState(
    initialLongitude ?? defaultCenter.lng
  );
  const [radius, setRadius] = React.useState(initialRadius ?? 100);
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const mapRef = React.useRef<L.Map | null>(null);

  // Ambil lokasi perangkat saat pertama kali
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setLatitude(lat);
          setLongitude(lng);
          onSelectLocation(lat, lng, radius);
          if (mapRef.current) mapRef.current.setView([lat, lng], 16);
          toast.success("Lokasi perangkat ditemukan 🎯");
        },
        (err) => {
          console.warn("Gagal ambil lokasi:", err);
          toast.warning(
            "Gagal mendeteksi lokasi perangkat, gunakan default peta."
          );
          onSelectLocation(latitude, longitude, radius);
        }
      );
    }
  }, []);

  // Pencarian lokasi (realtime, debounce ringan)
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.length < 3) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            search
          )}&addressdetails=1&limit=5`,
          {
            headers: {
              "User-Agent": "KidsTrackingApp/1.0 (contact@example.com)",
            },
          }
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        toast.error("Gagal mencari lokasi.");
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSelectResult = (place: any) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setLatitude(lat);
    setLongitude(lon);
    onSelectLocation(lat, lon, radius);
    if (mapRef.current) mapRef.current.setView([lat, lon], 16);
    setResults([]);
    setSearch(place.display_name);
    toast.success(`Lokasi dipilih: ${place.display_name}`);
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Input
            placeholder="Cari tempat (misal: SD Negeri 7 Batubulan)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 pl-10"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          {results.length > 0 && (
            <ul className="absolute z-10 mt-1 bg-gray-900/95 border border-gray-700 rounded-lg w-full max-h-52 overflow-y-auto shadow-lg">
              {results.map((place, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectResult(place)}
                  className="px-3 py-2 hover:bg-gray-800 cursor-pointer text-sm text-gray-200 border-b border-gray-700/30"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <div className="h-[300px] rounded-lg overflow-hidden relative z-0">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            scrollWheelZoom={true}
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

        {/* Radius Input */}
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
          <Ruler className="w-4 h-4 text-emerald-400" />
          <span>{radius} meter</span>
        </div>
      </CardContent>
    </Card>
  );
}
