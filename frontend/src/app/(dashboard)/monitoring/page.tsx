// frontend/src/app/(dashboard)/monitoring/page.tsx

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Search,
  Wifi,
  WifiOff,
  BatteryMedium,
  Clock,
  MapPin,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api-client";

import type {
  Perangkat,
  PenggunaTunanetra,
} from "@/types";

const MapView = dynamic(
  () =>
    import("@/components/map/MapView").then(
      (module) => module.MapView
    ),
  {
    ssr: false,
  }
);

type FilterStatus =
  | "semua"
  | "online"
  | "offline";

function formatWaktu(
  value: string | null
) {
  if (!value) {
    return "Belum ada data";
  }

  return new Date(value).toLocaleString(
    "id-ID"
  );
}

export default function MonitoringPage() {
  const [perangkat, setPerangkat] =
    useState<Perangkat[]>([]);

  const [pengguna, setPengguna] =
    useState<PenggunaTunanetra[]>([]);

  const [filter, setFilter] =
    useState<FilterStatus>("semua");

  const [cari, setCari] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function muatData(
    tampilkanLoading = true
  ) {
    if (tampilkanLoading) {
      setLoading(true);
    }

    try {
      const [dataPerangkat, dataPengguna] =
        await Promise.all([
          api.get<Perangkat[]>(
            "/perangkat"
          ),

          api.get<PenggunaTunanetra[]>(
            "/pengguna"
          ),
        ]);

      setPerangkat(dataPerangkat);
      setPengguna(dataPengguna);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data monitoring"
      );
    } finally {
      if (tampilkanLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    muatData();

    const interval = setInterval(() => {
      muatData(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function namaPengguna(
    idTunanetra: string | null
  ) {
    if (!idTunanetra) {
      return "Belum dipasangkan";
    }

    return (
      pengguna.find(
        (item) =>
          item.id_tunanetra ===
          idTunanetra
      )?.nama_tunanetra ??
      "Pengguna tidak ditemukan"
    );
  }

  const dataMonitoring = useMemo(() => {
    return perangkat.map((item) => ({
      ...item,

      nama: namaPengguna(
        item.dipakai_oleh
      ),
    }));
  }, [perangkat, pengguna]);

  const filtered = useMemo(() => {
    const keyword =
      cari.trim().toLowerCase();

    return dataMonitoring.filter(
      (item) => {
        const cocokStatus =
          filter === "semua" ||
          (filter === "online"
            ? item.status_online
            : !item.status_online);

        const cocokCari =
          !keyword ||
          item.nama
            .toLowerCase()
            .includes(keyword) ||
          item.id_perangkat
            .toLowerCase()
            .includes(keyword);

        return (
          cocokStatus &&
          cocokCari
        );
      }
    );
  }, [
    dataMonitoring,
    filter,
    cari,
  ]);

  const markers = useMemo(() => {
    return filtered
      .filter(
        (item) =>
          item.lat_terakhir !== null &&
          item.long_terakhir !== null
      )
      .map((item) => ({
        id_perangkat:
          item.id_perangkat,

        nama: item.nama,

        lat:
          item.lat_terakhir as number,

        lng:
          item.long_terakhir as number,

        online:
          item.status_online,
      }));
  }, [filtered]);

  if (loading) {
    return (
      <p className="text-text-secondary">
        Memuat data monitoring...
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
        title="Monitoring Lokasi"
        subtitle="Pantau posisi pengguna secara real-time"
      />

      <div className="flex h-[calc(100vh-11rem)] gap-4">
        <aside className="w-80 flex-shrink-0 overflow-y-auto rounded-card bg-surface p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Daftar Perangkat
            </h2>

            <Badge tone="primary">
              {perangkat.length} Perangkat
            </Badge>
          </div>

          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />

            <input
              type="text"
              placeholder="Cari pengguna / perangkat..."
              value={cari}
              onChange={(e) =>
                setCari(e.target.value)
              }
              className="w-full rounded-pill border border-border py-2 pl-9 pr-3 text-sm"
            />
          </div>

          <div className="mb-4 flex gap-2">
            {(
              [
                "semua",
                "online",
                "offline",
              ] as const
            ).map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`rounded-pill px-4 py-1.5 text-sm font-medium capitalize ${
                  filter === item
                    ? "bg-primary text-white"
                    : "border border-border-strong text-text-secondary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-text-secondary">
                Tidak ada perangkat.
              </p>
            )}

            {filtered.map((item) => {
              const punyaLokasi =
                item.lat_terakhir !==
                  null &&
                item.long_terakhir !==
                  null;

              return (
                <Link
                  key={
                    item.id_perangkat
                  }
                  href={`/monitoring/${item.id_perangkat}`}
                  className={`block rounded-card p-4 transition hover:opacity-90 ${
                    item.status_online
                      ? "bg-success-soft"
                      : "bg-danger-soft"
                  }`}
                >
                  <div className="text-lg font-semibold text-text-primary">
                    {item.nama}
                  </div>

                  <div className="font-mono text-sm text-text-secondary">
                    {
                      item.id_perangkat
                    }
                  </div>

                  <div className="mt-2 flex items-start gap-1 text-sm text-text-secondary">
                    <MapPin
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                    />

                    {punyaLokasi ? (
                      <span>
                        {item.lat_terakhir?.toFixed(
                          6
                        )}
                        ,{" "}
                        {item.long_terakhir?.toFixed(
                          6
                        )}
                      </span>
                    ) : (
                      <span>
                        Lokasi belum tersedia
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        item.status_online
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {item.status_online ? (
                        <Wifi size={14} />
                      ) : (
                        <WifiOff
                          size={14}
                        />
                      )}

                      {item.status_online
                        ? "Online"
                        : "Offline"}
                    </span>

                    <span className="flex items-center gap-1 text-text-secondary">
                      <BatteryMedium
                        size={14}
                      />

                      {item.baterai_terakhir ===
                      null
                        ? "—"
                        : `${item.baterai_terakhir}%`}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs text-text-secondary">
                    <Clock size={13} />

                    GPS:{" "}
                    {formatWaktu(
                      item.location_updated_at
                    )}
                  </div>

                  {item.gps_accuracy !==
                    null && (
                    <div className="mt-1 text-xs text-text-secondary">
                      Akurasi ±
                      {Math.round(
                        item.gps_accuracy
                      )}{" "}
                      meter
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="relative flex-1 overflow-hidden rounded-map">
          {markers.length > 0 ? (
            <MapView
              markers={markers}
            />
          ) : (
            <div className="flex h-full min-h-[500px] items-center justify-center rounded-map bg-surface shadow-card">
              <div className="text-center">
                <MapPin
                  size={32}
                  className="mx-auto mb-3 text-text-secondary"
                />

                <p className="font-medium text-text-primary">
                  Belum ada data GPS
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  Posisi akan muncul
                  setelah perangkat
                  mengirim lokasi.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}