"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function pinIcon(color: string) {
  return new L.DivIcon({
    className: "",
    html: `<svg width="30" height="40" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
}
const iconOnline = pinIcon("#2F8F5B");
const iconOffline = pinIcon("#C6362F");

export type MarkerData = { id_perangkat: string; nama: string; lat: number; lng: number; online: boolean };

export function MapView({ markers }: { markers: MarkerData[] }) {
  const center: [number, number] = markers.length ? [markers[0].lat, markers[0].lng] : [-6.9932, 110.4203];

  return (
    <MapContainer center={center} zoom={15} className="h-full w-full rounded-map" style={{ minHeight: 500 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {markers.map((m) => (
        <Marker key={m.id_perangkat} position={[m.lat, m.lng]} icon={m.online ? iconOnline : iconOffline}>
          <Popup>
            <strong>{m.nama}</strong>
            <br />
            {m.id_perangkat} — {m.online ? "Online" : "Offline"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}