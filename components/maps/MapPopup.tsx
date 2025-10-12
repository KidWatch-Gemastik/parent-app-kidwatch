"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const icon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
});

export default function MapPopup({
  lat,
  lng,
  address,
  onClose,
}: {
  lat: number;
  lng: number;
  address: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-4 w-[90%] max-w-3xl relative">
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 mb-3"
          variant={'ghost'}
        >
          <X />
        </Button>
        <div className="text-white mb-3 text-sm">{address}</div>
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          className="h-[400px] rounded-xl"
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>
              <div className="text-center">
                <p className="text-sm">{address}</p>
                <Button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${lat},${lng}`,
                      "_blank"
                    )
                  }
                  className="mt-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  Show on Maps
                </Button>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
