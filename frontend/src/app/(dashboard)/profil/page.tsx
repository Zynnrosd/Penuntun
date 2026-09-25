//frontend/src/app/(dashboard)/profil/page.tsx

"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api-client";

type ProfilResponse = {
  nama_staf: string;
  email: string;
  no_wa: string | null;
  role: "administrator" | "pengawas";
  yayasan: { nama_yayasan: string } | null;
};

export default function ProfilPage() {
  const [data, setData] = useState<ProfilResponse | null>(null);
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  useEffect(() => {
    api
      .get<ProfilResponse>("/pengaturan/profil")
      .then((res) => {
        setData(res);
        setNama(res.nama_staf);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSukses("");
    setSaving(true);
    try {
      await api.patch("/pengaturan/profil", { nama_staf: nama });
      setSukses("Profil berhasil diperbarui");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-text-secondary">Memuat data...</p>;
  if (!data) return <p className="text-danger">Gagal memuat profil.</p>;

  return (
    <div className="max-w-md">
      <PageHeader title="Profil Akun" />

      <div className="rounded-card bg-surface p-6 shadow-card">
        {error && <div className="mb-4 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}
        {sukses && <div className="mb-4 rounded-input bg-success-soft px-3 py-2 text-sm text-success">{sukses}</div>}

        <form onSubmit={simpan}>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Nama Lengkap</label>
          <input
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="mb-4 w-full rounded-input border border-border px-3 py-2 text-sm"
          />

          <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
          <input disabled value={data.email} className="mb-4 w-full rounded-input border border-border bg-surface-sunken px-3 py-2 text-sm text-text-secondary" />

          <label className="mb-1 block text-sm font-medium text-text-secondary">Peran</label>
          <input
            disabled
            value={data.role === "administrator" ? "Administrator" : "Pengawas"}
            className="mb-4 w-full rounded-input border border-border bg-surface-sunken px-3 py-2 text-sm text-text-secondary"
          />

          <label className="mb-1 block text-sm font-medium text-text-secondary">Yayasan</label>
          <input
            disabled
            value={data.yayasan?.nama_yayasan ?? "-"}
            className="mb-6 w-full rounded-input border border-border bg-surface-sunken px-3 py-2 text-sm text-text-secondary"
          />

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