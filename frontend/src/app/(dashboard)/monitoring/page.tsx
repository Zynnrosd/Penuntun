"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Search, Wifi, WifiOff, BatteryMedium, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";

const MapView = dynamic(() => import("@/components/map/MapView").then((m) => m.MapView), { ssr: false });

const DATA_DUMMY = [
  { id_perangkat: "PNT-001", nama: "Althaf", lokasi: "Jl. Jambu, Semarang Selatan", lat: -6.9932, lng: 110.4203, online: true, baterai: 67 },
  { id_perangkat: "PNT-002", nama: "Izac", lokasi: "Jl. Buntu, Semarang Selatan", lat: -6.995, lng: 110.418, online: false, baterai: 20, terakhirTerlihat: "10 menit lalu" },
];

export default function MonitoringPage() {
  const [filter, setFilter] = useState<"semua" | "online" | "offline">("semua");
  const [cari, setCari] = useState("");

  const filtered = DATA_DUMMY.filter((d) => {
    const cocokFilter = filter === "semua" || (filter === "online" ? d.online : !d.online);
    const cocokCari = d.nama.toLowerCase().includes(cari.toLowerCase());
    return cocokFilter && cocokCari;
  });

  return (
    <div>
      <PageHeader title="Monitoring Lokasi" subtitle="Pantau posisi pengguna secara real-time" />

      <div className="flex h-[calc(100vh-11rem)] gap-4">
        <aside className="w-80 flex-shrink-0 overflow-y-auto rounded-card bg-surface p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Daftar Perangkat</h2>
            <Badge tone="primary">{DATA_DUMMY.length} Perangkat</Badge>
          </div>

          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Cari pengguna..."
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              className="w-full rounded-pill border border-border py-2 pl-9 pr-3 text-sm"
            />
          </div>

          <div className="mb-4 flex gap-2">
            {(["semua", "online", "offline"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-pill px-4 py-1.5 text-sm font-medium capitalize ${
                  filter === f ? "bg-primary text-white" : "border border-border-strong text-text-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((d) => (
              <div
                key={d.id_perangkat}
                className={`rounded-card p-4 ${d.online ? "bg-success-soft" : "bg-danger-soft"}`}
              >
                <div className="text-lg font-semibold text-text-primary">{d.nama}</div>
                <div className="font-mono text-sm text-text-secondary">{d.id_perangkat}</div>
                <div className="text-sm text-text-secondary">{d.lokasi}</div>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className={`flex items-center gap-1 font-medium ${d.online ? "text-success" : "text-danger"}`}>
                    {d.online ? <Wifi size={14} /> : <WifiOff size={14} />}
                    {d.online ? "Online" : "Offline"}
                  </span>
                  {!d.online && d.terakhirTerlihat && (
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Clock size={14} /> {d.terakhirTerlihat}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-text-secondary">
                    <BatteryMedium size={14} /> {d.baterai}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="relative flex-1">
          <MapView markers={DATA_DUMMY} />
        </div>
      </div>
    </div>
  );
}