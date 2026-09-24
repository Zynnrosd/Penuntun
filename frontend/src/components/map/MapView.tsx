// frontend/src/components/map/MapView.tsx

"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

function pinIcon(color: string) {
  return new L.DivIcon({
    className: "",
    html: `
      <svg
        width="30"
        height="40"
        viewBox="0 0 32 42"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z"
          fill="${color}"
          stroke="white"
          stroke-width="2"
        />
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
}

const iconOnline = pinIcon("#2F8F5B");
const iconOffline = pinIcon("#C6362F");

export type MarkerData = {
  id_perangkat: string;
  nama: string;
  lat: number;
  lng: number;
  online: boolean;
};

function MapUpdater({
  markers,
}: {
  markers: MarkerData[];
}) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) {
      return;
    }

    if (markers.length === 1) {
      map.setView(
        [markers[0].lat, markers[0].lng],
        17
      );

      return;
    }

    const bounds = L.latLngBounds(
      markers.map((marker) => [
        marker.lat,
        marker.lng,
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [markers, map]);

  return null;
}

export function MapView({
  markers,
}: {
  markers: MarkerData[];
}) {
  const defaultCenter: [number, number] = [
    -6.9932,
    110.4203,
  ];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      className="h-full w-full rounded-map"
      style={{ minHeight: 500 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapUpdater markers={markers} />

      {markers.map((marker) => (
        <Marker
          key={marker.id_perangkat}
          position={[
            marker.lat,
            marker.lng,
          ]}
          icon={
            marker.online
              ? iconOnline
              : iconOffline
          }
        >
          <Popup>
            <strong>{marker.nama}</strong>

            <br />

            {marker.id_perangkat}

            <br />

            {marker.online
              ? "Online"
              : "Offline"}

            <br />

            {marker.lat.toFixed(6)},{" "}
            {marker.lng.toFixed(6)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}