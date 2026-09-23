"use client";
import { useState } from "react";

export default function PengaturanWhatsAppPage() {
  const [nomor, setNomor] = useState("+6281234567890");

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-xl font-semibold text-text-primary">Konfigurasi Routing Notifikasi WhatsApp</h1>

      <div className="rounded-card bg-surface p-6 shadow-card">
        <label className="mb-1 block text-sm font-medium text-text-secondary">Nomor WhatsApp Tujuan</label>
        <input
          type="text"
          value={nomor}
          onChange={(e) => setNomor(e.target.value)}
          className="mb-2 w-full rounded-input border border-border px-3 py-2 text-sm"
        />
        <p className="mb-4 text-xs text-text-secondary">
          Nomor ini akan menerima semua notifikasi darurat SOS dan pelanggaran zona aman.
        </p>
        <button className="w-full rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          Simpan perubahan
        </button>
      </div>
    </div>
  );
}