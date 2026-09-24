// frontend/src/types/index.ts

export type Perangkat = {
  id_perangkat: string;
  id_yayasan: string;
  dipakai_oleh: string | null;

  lat_terakhir: number | null;
  long_terakhir: number | null;
  lokasi_terakhir: string | null;

  gps_accuracy: number | null;
  location_updated_at: string | null;

  baterai_terakhir: number | null;

  status_online: boolean;
  status_sos: boolean;

  last_active: string | null;
};

export type PenggunaTunanetra = {
  id_tunanetra: string;
  id_yayasan: string;
  nama_tunanetra: string;
  alamat: string | null;
};

export type Notifikasi = {
  id_notifikasi: number;
  id_perangkat: string;
  kode_insiden: string;
  tipe_event: "SOS" | "GEOFENCE";
  status: "AKTIF" | "SELESAI";
  deskripsi: string | null;
  occurred_at: string;
};

export type NotifikasiDelivery = {
  id_delivery: number;
  id_notifikasi: number;
  status: "SENT" | "FAILED";
};

export type LokasiPerangkat = {
  id_lokasi: number;
  id_perangkat: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  source: string;
  recorded_at: string;
};