"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ruler, Search } from "lucide-react";
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
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const mapRef = React.useRef<L.Map | null>(null);

  // Ambil lokasi user di awal
  React.useEffect(() => {
    if (!initialLatitude && !initialLongitude && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setLatitude(lat);
          setLongitude(lng);
          onSelectLocation(lat, lng, radius);
          if (mapRef.current) mapRef.current.setView([lat, lng], 16);
          toast.success("Lokasi kamu berhasil didapatkan");
        },
        (err) => {
          console.warn("Gagal ambil lokasi:", err);
          toast.error("Tidak bisa mendeteksi lokasi otomatis");
          onSelectLocation(latitude, longitude, radius);
        }
      );
    } else {
      onSelectLocation(latitude, longitude, radius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search lokasi (Mapbox)
  React.useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_TOKEN}&limit=5&country=id`
        );
        const data = await res.json();
        setResults(data.features || []);
      } catch (err) {
        console.error("Error fetch lokasi:", err);
        toast.error("Gagal mengambil data lokasi");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  // Handle pilih lokasi dari dropdown
  const handleSelectPlace = (place: any) => {
    const [lng, lat] = place.center;
    setLatitude(lat);
    setLongitude(lng);
    setQuery(place.place_name);
    setResults([]);
    onSelectLocation(lat, lng, radius);
    if (mapRef.current) mapRef.current.setView([lat, lng], 16);
    toast.success(`Lokasi dipilih: ${place.text}`);
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="relative">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder={label}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-black"
            />
          </div>

          {/* Dropdown hasil pencarian */}
          {results.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white text-black border rounded-lg shadow-md mt-2 z-50 max-h-60 overflow-auto">
              {results.map((place) => (
                <li
                  key={place.id}
                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                  onClick={() => handleSelectPlace(place)}
                >
                  {place.place_name}
                </li>
              ))}
            </ul>
          )}
          {loading && (
            <div className="absolute right-3 top-3 text-xs text-gray-400 animate-pulse">
              Mencari...
            </div>
          )}
        </div>

        {/* Map */}
        <div className="h-[300px] rounded-lg overflow-hidden relative z-0">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
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

        {/* Radius selector */}
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
