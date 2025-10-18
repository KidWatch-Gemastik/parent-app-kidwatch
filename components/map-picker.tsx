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
import { Button } from "@/components/ui/button";
import { Ruler, Search } from "lucide-react";
import L from "leaflet";

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
  label = "Pilih Lokasi di Peta",
}: MapPickerProps) {
  const [latitude, setLatitude] = React.useState(
    initialLatitude ?? defaultCenter.lat
  );
  const [longitude, setLongitude] = React.useState(
    initialLongitude ?? defaultCenter.lng
  );
  const [radius, setRadius] = React.useState(initialRadius ?? 100);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const mapRef = React.useRef<L.Map | null>(null);

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

          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16);
          }
        },
        (err) => {
          console.warn("Gagal ambil lokasi pengguna:", err);
          onSelectLocation(latitude, longitude, radius);
        }
      );
    } else {
      onSelectLocation(latitude, longitude, radius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setLatitude(lat);
        setLongitude(lng);
        onSelectLocation(lat, lng, radius);

        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 16);
        }
      } else {
        alert("Lokasi tidak ditemukan.");
      }
    } catch (err) {
      console.error("Error mencari lokasi:", err);
      alert("Terjadi kesalahan saat mencari lokasi.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-gray-300 font-medium">{label}</p>

          <div className="flex gap-2">
            <Input
              placeholder="Cari lokasi (misal: Sekolah SDN 1 Denpasar)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 rounded-xl h-10"
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 h-10"
            >
              <Search className="w-4 h-4" />
              {isSearching ? "Mencari..." : "Cari"}
            </Button>
          </div>
        </div>

        {/* 🗺️ Map Area */}
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
