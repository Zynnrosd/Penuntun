"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, MapPin, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";

const MapView = dynamic(() => import("@/components/map/MapView").then((m) => m.MapView), { ssr: false });

type Insiden = {
  id_notifikasi: number;
  kode_insiden: string;
  nama: string;
  id_perangkat: string;
  lokasi: string;
  tipe_event: "SOS" | "GEOFENCE";
  status: "AKTIF" | "SELESAI";
  deskripsi: string;
  prioritas: "RENDAH" | "SEDANG" | "TINGGI";
  lat: number;
  lng: number;
  waktuKejadian: string;
  waktuTerkirim: string;
};

const DATA_DUMMY: Insiden[] = [
  {
    id_notifikasi: 2,
    kode_insiden: "SOS-002",
    nama: "Althaf",
    id_perangkat: "PNT-001",
    lokasi: "Jl. Jambu, Semarang Selatan",
    tipe_event: "SOS",
    status: "AKTIF",
    deskripsi: "Tombol SOS Ditekan",
    prioritas: "TINGGI",
    lat: -6.9932,
    lng: 110.4203,
    waktuKejadian: "10:32 WIB",
    waktuTerkirim: "10:32 WIB",
  },
  {
    id_notifikasi: 1,
    kode_insiden: "SOS-001",
    nama: "Althaf",
    id_perangkat: "PNT-001",
    lokasi: "Jl. Jambu, Semarang Selatan",
    tipe_event: "SOS",
    status: "SELESAI",
    deskripsi: "Tombol SOS Ditekan",
    prioritas: "SEDANG",
    lat: -6.9932,
    lng: 110.4203,
    waktuKejadian: "08:32 WIB",
    waktuTerkirim: "08:32 WIB",
  },
];

export default function NotifikasiPage() {
  const [list, setList] = useState(DATA_DUMMY);
  const [pilih, setPilih] = useState<Insiden | null>(null);

  const aktif = list.filter((n) => n.status === "AKTIF").length;
  const selesai = list.filter((n) => n.status === "SELESAI").length;

  function tandaiSelesai(id: number) {
    setList((prev) => prev.map((n) => (n.id_notifikasi === id ? { ...n, status: "SELESAI" as const } : n)));
    setPilih((prev) => (prev && prev.id_notifikasi === id ? { ...prev, status: "SELESAI" as const } : prev));
  }

  return (
    <div>
      <PageHeader title="Notifikasi SOS" subtitle="Peringatan darurat yang perlu perhatian segera" />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Kejadian Hari Ini" value={list.length} tone="primary" suffix="Perangkat" />
        <StatCard label="Sudah Ditangani" value={selesai} tone="success" suffix="Perangkat" />
        <StatCard label="SOS Aktif" value={aktif} tone="danger" suffix="Perangkat" />
      </div>

      <div className="flex gap-4">
        <div className={`rounded-card bg-surface p-5 shadow-card transition-all ${pilih ? "w-[420px] flex-shrink-0" : "flex-1"}`}>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Daftar Notifikasi SOS</h2>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Cari Berdasarkan Nama"
              className="w-full rounded-pill border border-border py-2 pl-9 pr-3 text-sm"
            />
          </div>

          <div className="space-y-3">
            {list.map((n) => (
              <div key={n.id_notifikasi} className={`rounded-card p-4 ${n.status === "AKTIF" ? "bg-danger-soft" : "bg-success-soft"}`}>
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white ${
                      n.status === "AKTIF" ? "bg-danger" : "bg-success"
                    }`}
                  >
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-text-primary">{n.nama}</div>
                    <div className="font-mono text-sm text-text-secondary">{n.id_perangkat}</div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                      <MapPin size={14} /> {n.lokasi}
                    </div>
                    <div className="mt-1 text-sm text-text-secondary">
                      Kejadian pada {n.waktuKejadian} • {n.kode_insiden}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setPilih(n)}
                        className="flex items-center gap-1 rounded-input bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover"
                      >
                        <MapPin size={14} /> Lihat Lokasi
                      </button>
                      {n.status === "AKTIF" ? (
                        <button
                          onClick={() => tandaiSelesai(n.id_notifikasi)}
                          className="rounded-input bg-success px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                        >
                          ✓ Tandai Selesai
                        </button>
                      ) : (
                        <button disabled className="rounded-input border border-border-strong px-3 py-1.5 text-sm text-text-secondary">
                          Selesai
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {pilih && (
          <div className="flex-1 rounded-card bg-surface p-5 shadow-card">
            <h2 className="mb-3 text-center text-lg font-semibold text-text-primary">Lokasi: {pilih.nama}</h2>
            <div className="h-64 overflow-hidden rounded-map">
              <MapView markers={[{ id_perangkat: pilih.id_perangkat, nama: pilih.nama, lat: pilih.lat, lng: pilih.lng, online: true }]} />
            </div>

            <h3 className="mb-3 mt-5 text-lg font-semibold text-text-primary">Detail Insiden</h3>
            <dl className="space-y-3 text-sm">
              {[
                ["ID Insiden", pilih.kode_insiden],
                ["Pengguna", pilih.nama],
                ["Kode Perangkat", pilih.id_perangkat],
                ["Tipe Kejadian", pilih.tipe_event],
                ["Deskripsi", pilih.deskripsi],
                ["Tingkat Urgensi", pilih.prioritas === "TINGGI" ? "Tinggi" : pilih.prioritas === "SEDANG" ? "Sedang" : "Rendah"],
                ["Koordinat", `${pilih.lat}, ${pilih.lng}`],
                ["Notifikasi Terkirim", pilih.waktuTerkirim],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border pb-2">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="font-medium text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}