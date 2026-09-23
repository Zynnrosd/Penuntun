"use client";
import { useParams, useRouter } from "next/navigation";

const DATA_DUMMY: Record<string, { nama: string; baterai: number; lokasi: string; status: "online" | "offline" }> = {
  "PNT-001": { nama: "Althaf", baterai: 67, lokasi: "Jl. Jambu, Semarang Selatan", status: "online" },
  "PNT-002": { nama: "Izac", baterai: 22, lokasi: "Jl. Bumi, Semarang Selatan", status: "offline" },
};

export default function MonitoringDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const data = DATA_DUMMY[id];

  if (!data) return <p className="text-text-secondary">Perangkat tidak ditemukan.</p>;

  return (
    <div>
      <button onClick={() => router.back()} className="mb-4 text-sm text-primary hover:underline">
        ← Kembali ke Monitoring Lokasi
      </button>
      <h1 className="mb-4 text-xl font-semibold text-text-primary">
        {data.nama} — {id}
      </h1>

      <div className="rounded-card bg-surface p-6 shadow-card">
        <p className="text-sm text-text-secondary">Status</p>
        <p className="mb-3 font-medium text-text-primary">{data.status === "online" ? "Online" : "Offline"}</p>

        <p className="text-sm text-text-secondary">Baterai</p>
        <p className="mb-3 font-medium text-text-primary">{data.baterai}%</p>

        <p className="text-sm text-text-secondary">Lokasi Terakhir</p>
        <p className="mb-4 font-medium text-text-primary">{data.lokasi}</p>

        <button className="rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          Lihat riwayat perjalanan
        </button>
      </div>
    </div>
  );
}