//frontend/src/app/(dashboard)/pengaturan/whatsapp/page.tsx

"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api-client";

export default function PengaturanWhatsAppPage() {
  const [nomor, setNomor] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  useEffect(() => {
    api
      .get<{ no_wa: string | null }>("/pengaturan/whatsapp")
      .then((res) => setNomor(res.no_wa ?? ""))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSukses("");
    setSaving(true);
    try {
      await api.patch("/pengaturan/whatsapp", { no_wa: nomor });
      setSukses("Nomor WhatsApp berhasil disimpan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-text-secondary">Memuat data...</p>;

  return (
    <div className="max-w-md">
      <PageHeader title="Konfigurasi Routing Notifikasi WhatsApp" />

      <div className="rounded-card bg-surface p-6 shadow-card">
        {error && <div className="mb-4 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}
        {sukses && <div className="mb-4 rounded-input bg-success-soft px-3 py-2 text-sm text-success">{sukses}</div>}

        <form onSubmit={simpan}>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Nomor WhatsApp Tujuan</label>
          <input
            type="text"
            required
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            placeholder="+6281234567890"
            className="mb-2 w-full rounded-input border border-border px-3 py-2 text-sm"
          />
          <p className="mb-4 text-xs text-text-secondary">
            Nomor ini akan menerima semua notifikasi darurat SOS dan pelanggaran zona aman.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}