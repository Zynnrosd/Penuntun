// frontend/src/app/(dashboard)/perangkat/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api-client";
import type { Perangkat, PenggunaTunanetra } from "@/types";

function inisial(nama: string) {
  return nama
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PerangkatPage() {
  const [data, setData] = useState<Perangkat[]>([]);
  const [pengguna, setPengguna] = useState<PenggunaTunanetra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalTambah, setModalTambah] = useState(false);
  const [idBaru, setIdBaru] = useState("");
  const [formError, setFormError] = useState("");
  const [hapusTarget, setHapusTarget] =
    useState<Perangkat | null>(null);

  async function muat(tampilkanLoading = true) {
    if (tampilkanLoading) {
      setLoading(true);
    }

    try {
      const [p, u] = await Promise.all([
        api.get<Perangkat[]>("/perangkat"),
        api.get<PenggunaTunanetra[]>("/pengguna"),
      ]);

      setData(p);
      setPengguna(u);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data"
      );
    } finally {
      if (tampilkanLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    muat();

    const interval = setInterval(() => {
      muat(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function tambahPerangkat(e: React.FormEvent) {
    e.preventDefault();

    setFormError("");

    try {
      await api.post("/perangkat", {
        id_perangkat: idBaru,
      });

      setModalTambah(false);
      setIdBaru("");

      await muat(false);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal menambah perangkat"
      );
    }
  }

  async function ubahPairing(
    idPerangkat: string,
    dipakaiOleh: string
  ) {
    try {
      await api.patch(
        `/perangkat/${idPerangkat}/pairing`,
        {
          dipakai_oleh: dipakaiOleh || null,
        }
      );

      await muat(false);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal mengubah pairing"
      );
    }
  }

  async function konfirmasiHapus() {
    if (!hapusTarget) {
      return;
    }

    try {
      await api.delete(
        `/perangkat/${hapusTarget.id_perangkat}`
      );

      setHapusTarget(null);

      await muat(false);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menghapus"
      );

      setHapusTarget(null);
    }
  }

  function namaPengguna(id: string | null) {
    return (
      pengguna.find(
        (u) => u.id_tunanetra === id
      )?.nama_tunanetra ?? null
    );
  }

  if (loading) {
    return (
      <p className="text-text-secondary">
        Memuat data...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-danger">
        Gagal memuat: {error}
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Manajemen Perangkat"
        subtitle="Kelola data perangkat dan pengguna"
      />

      <div className="mb-6 grid grid-cols-2 gap-4">
        <StatCard
          label="Total Perangkat"
          value={data.length}
          tone="primary"
          suffix="Terhubung"
        />

        <StatCard
          label="Total Pengguna Terpasang"
          value={
            data.filter(
              (d) => d.dipakai_oleh
            ).length
          }
          tone="success"
          suffix="Pengguna"
        />
      </div>

      <div className="rounded-card bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Manajemen Perangkat & Pengguna
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />

              <input
                placeholder="Cari Pengguna"
                className="rounded-pill border border-border py-2 pl-9 pr-3 text-sm"
              />
            </div>

            <button
              onClick={() => {
                setIdBaru("");
                setFormError("");
                setModalTambah(true);
              }}
              className="rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              + Tambah Perangkat
            </button>
          </div>
        </div>

        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">
            Belum ada perangkat terdaftar.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-text-secondary">
              <tr className="border-b border-border">
                <th className="py-3 pr-3">No.</th>
                <th className="py-3 pr-3">
                  Pemakai Aktif
                </th>
                <th className="py-3 pr-3">
                  ID Perangkat
                </th>
                <th className="py-3 pr-3">
                  Status
                </th>
                <th className="py-3 pr-3">
                  Aksi Langsung
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((d, i) => {
                const nama = namaPengguna(
                  d.dipakai_oleh
                );

                return (
                  <tr
                    key={d.id_perangkat}
                    className="border-b border-border"
                  >
                    <td className="py-3 pr-3 text-text-secondary">
                      {i + 1}.
                    </td>

                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {nama && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                            {inisial(nama)}
                          </span>
                        )}

                        <select
                          value={
                            d.dipakai_oleh ?? ""
                          }
                          onChange={(e) =>
                            ubahPairing(
                              d.id_perangkat,
                              e.target.value
                            )
                          }
                          className="rounded-input border border-border px-2 py-1 text-sm"
                        >
                          <option value="">
                            — Tidak terpasang —
                          </option>

                          {pengguna
                            .filter((u) => {
                              const sudahDipakaiDiLain =
                                data.some(
                                  (p) =>
                                    p.dipakai_oleh ===
                                      u.id_tunanetra &&
                                    p.id_perangkat !==
                                      d.id_perangkat
                                );

                              return !sudahDipakaiDiLain;
                            })
                            .map((u) => (
                              <option
                                key={u.id_tunanetra}
                                value={u.id_tunanetra}
                              >
                                {u.nama_tunanetra}
                              </option>
                            ))}
                        </select>
                      </div>
                    </td>

                    <td className="py-3 pr-3 font-mono text-text-primary">
                      {d.id_perangkat}
                    </td>

                    <td className="py-3 pr-3">
                      <span
                        className={
                          d.status_online
                            ? "font-medium text-success"
                            : "font-medium text-text-secondary"
                        }
                      >
                        {d.status_online
                          ? "Online"
                          : "Offline"}
                      </span>
                    </td>

                    <td className="py-3 pr-3">
                      <button
                        onClick={() =>
                          setHapusTarget(d)
                        }
                        className="text-text-secondary hover:text-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalTambah && (
        <Modal
          title="Tambah Perangkat"
          onClose={() =>
            setModalTambah(false)
          }
        >
          <form onSubmit={tambahPerangkat}>
            {formError && (
              <div className="mb-3 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">
                {formError}
              </div>
            )}

            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Serial Number / ID Perangkat
            </label>

            <input
              required
              value={idBaru}
              onChange={(e) =>
                setIdBaru(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="PNT-A01"
              className="mb-6 w-full rounded-input border border-border px-3 py-2 text-sm font-mono"
            />

            <button
              type="submit"
              className="w-full rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Tambah
            </button>
          </form>
        </Modal>
      )}

      {hapusTarget && (
        <Modal
          title="Hapus Perangkat"
          onClose={() =>
            setHapusTarget(null)
          }
        >
          <p className="mb-6 text-sm text-text-secondary">
            Yakin ingin menghapus perangkat{" "}
            <strong>
              {hapusTarget.id_perangkat}
            </strong>
            ?
          </p>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setHapusTarget(null)
              }
              className="flex-1 rounded-input border border-border-strong px-4 py-2 text-sm hover:bg-surface-sunken"
            >
              Batal
            </button>

            <button
              onClick={konfirmasiHapus}
              className="flex-1 rounded-input bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}