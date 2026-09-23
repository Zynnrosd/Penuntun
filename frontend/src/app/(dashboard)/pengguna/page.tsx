"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api-client";
import type { PenggunaTunanetra } from "@/types";

export default function PenggunaPage() {
  const [data, setData] = useState<PenggunaTunanetra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<"tambah" | "edit" | null>(null);
  const [editing, setEditing] = useState<PenggunaTunanetra | null>(null);
  const [form, setForm] = useState({ nama_tunanetra: "", alamat: "" });
  const [formError, setFormError] = useState("");
  const [hapusTarget, setHapusTarget] = useState<PenggunaTunanetra | null>(null);

  function muat() {
    setLoading(true);
    api
      .get<PenggunaTunanetra[]>("/pengguna")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(muat, []);

  function bukaTambah() {
    setForm({ nama_tunanetra: "", alamat: "" });
    setFormError("");
    setModal("tambah");
  }

  function bukaEdit(p: PenggunaTunanetra) {
    setEditing(p);
    setForm({ nama_tunanetra: p.nama_tunanetra, alamat: p.alamat ?? "" });
    setFormError("");
    setModal("edit");
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    try {
      if (modal === "tambah") {
        await api.post("/pengguna", form);
      } else if (modal === "edit" && editing) {
        await api.patch(`/pengguna/${editing.id_tunanetra}`, form);
      }
      setModal(null);
      muat();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan");
    }
  }

  async function konfirmasiHapus() {
    if (!hapusTarget) return;
    try {
      await api.delete(`/pengguna/${hapusTarget.id_tunanetra}`);
      setHapusTarget(null);
      muat();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
      setHapusTarget(null);
    }
  }

  if (loading) return <p className="text-text-secondary">Memuat data...</p>;
  if (error) return <p className="text-danger">Gagal memuat: {error}</p>;

  return (
    <div>
      <PageHeader title="Kelola Pengguna Tunanetra" />
      <div className="mb-6 flex justify-end">
        <button onClick={bukaTambah} className="rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          + Tambah Pengguna
        </button>
      </div>

      <div className="overflow-hidden rounded-card bg-surface shadow-card">
        {data.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-secondary">Belum ada pengguna terdaftar.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken text-left text-text-secondary">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Alamat</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id_tunanetra} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-text-primary">{p.nama_tunanetra}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.alamat ?? "-"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => bukaEdit(p)} className="mr-2 text-sm text-primary hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setHapusTarget(p)} className="text-sm text-danger hover:underline">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === "tambah" ? "Tambah Pengguna" : "Edit Pengguna"} onClose={() => setModal(null)}>
          <form onSubmit={simpan}>
            {formError && <div className="mb-3 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</div>}

            <label className="mb-1 block text-sm font-medium text-text-secondary">Nama Lengkap</label>
            <input
              required
              value={form.nama_tunanetra}
              onChange={(e) => setForm((f) => ({ ...f, nama_tunanetra: e.target.value }))}
              className="mb-4 w-full rounded-input border border-border px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-sm font-medium text-text-secondary">Alamat</label>
            <input
              value={form.alamat}
              onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
              className="mb-6 w-full rounded-input border border-border px-3 py-2 text-sm"
            />

            <button type="submit" className="w-full rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
              Simpan
            </button>
          </form>
        </Modal>
      )}

      {hapusTarget && (
        <Modal title="Hapus Pengguna" onClose={() => setHapusTarget(null)}>
          <p className="mb-6 text-sm text-text-secondary">
            Yakin ingin menghapus <strong>{hapusTarget.nama_tunanetra}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setHapusTarget(null)}
              className="flex-1 rounded-input border border-border-strong px-4 py-2 text-sm hover:bg-surface-sunken"
            >
              Batal
            </button>
            <button onClick={konfirmasiHapus} className="flex-1 rounded-input bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Hapus
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}