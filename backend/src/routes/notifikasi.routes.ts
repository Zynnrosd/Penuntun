import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth, getSession } from "../lib/auth";
import { kirimNotifikasiWhatsApp } from "../services/whatsapp.service";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const { id_yayasan } = getSession(req);
  const { data, error } = await supabase
    .from("notifikasi")
    .select("*, perangkat!inner(id_yayasan)")
    .eq("perangkat.id_yayasan", id_yayasan)
    .order("occurred_at", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

router.post("/", async (req, res) => {
  const { id_perangkat, tipe_event, deskripsi, latitude_sos, longitude_sos } = req.body;
  const kode_insiden = `${tipe_event}-${Date.now()}`;

const { data: notif, error } = await supabase
  .from("notifikasi")
  .insert({ id_perangkat, kode_insiden, tipe_event, deskripsi, latitude_sos, longitude_sos, status: "AKTIF" })
  .select()
  .single();
if (error || !notif) return res.status(400).json({ message: error?.message ?? "Gagal membuat notifikasi" });

  const { data: perangkat } = await supabase.from("perangkat").select("id_yayasan").eq("id_perangkat", id_perangkat).single();
  const { data: admin } = await supabase.from("administrators").select("no_wa").eq("id_yayasan", perangkat?.id_yayasan).limit(1).single();

  const statusKirim = admin?.no_wa ? await kirimNotifikasiWhatsApp(admin.no_wa, deskripsi) : "FAILED";
  await supabase.from("notifikasi_delivery").insert({ id_notifikasi: notif.id_notifikasi, status: statusKirim });

  res.status(201).json(notif);
});

router.patch("/:id/selesai", async (req, res) => {
  const { data, error } = await supabase
    .from("notifikasi")
    .update({ status: "SELESAI" })
    .eq("id_notifikasi", req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

export default router;