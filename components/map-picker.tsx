"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
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
}

const defaultCenter = { lat: -8.65, lng: 115.216667 }; // Bali default

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
      toast.success("Lokasi dipilih dari peta");
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
  const [loading, setLoading] = React.useState(false);

  const mapRef = React.useRef<L.Map | null>(null);

  // === Ambil lokasi pengguna saat mount ===
  React.useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          onSelectLocation(lat, lng, radius);
          if (mapRef.current) mapRef.current.setView([lat, lng], 16);
          toast.success("Lokasi perangkat ditemukan");
        },
        () => {
          toast.error("Tidak dapat mengakses lokasi perangkat");
          onSelectLocation(latitude, longitude, radius);
        }
      );
    } else {
      onSelectLocation(latitude, longitude, radius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Search lokasi pakai OpenStreetMap (Nominatim) ===
  React.useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            search
          )}&addressdetails=1&limit=5`,
          {
            headers: {
              "User-Agent": "YourAppName/1.0 (contact@yourdomain.com)",
            },
          }
        );
        const data = await res.json();
        setResults(data || []);
      } catch {
        toast.error("Gagal mencari lokasi");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSelectPlace = (place: any) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setLatitude(lat);
    setLongitude(lng);
    setResults([]);
    setSearch(place.display_name);
    onSelectLocation(lat, lng, radius);
    if (mapRef.current) mapRef.current.setView([lat, lng], 16);
    toast.success(`Lokasi dipilih: ${place.display_name}`);
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4">
        {/* Input Search */}
        <div className="relative">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama tempat (contoh: SD Negeri 7 Batubulan)"
            className="text-black w-full"
          />
          {loading && (
            <p className="absolute right-3 top-2 text-xs text-gray-400">
              Mencari...
            </p>
          )}
          {results.length > 0 && (
            <ul className="absolute z-10 bg-white text-black mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-auto">
              {results.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handleSelectPlace(place)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Peta */}
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

        {/* Input Radius */}
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span>Radius:</span>
          <Input
            type="number"
            min={10}
            max={2000}
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
