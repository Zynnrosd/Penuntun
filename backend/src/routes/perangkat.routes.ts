import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth, requireRole, getSession } from "../lib/auth";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const { id_yayasan } = getSession(req);
  const { data, error } = await supabase.from("perangkat").select("*").eq("id_yayasan", id_yayasan);
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

router.post("/", requireRole("administrator"), async (req, res) => {
  const { id_yayasan } = getSession(req);
  const { id_perangkat } = req.body;

  const { data: existing } = await supabase.from("perangkat").select("id_perangkat").eq("id_perangkat", id_perangkat).single();
  if (existing) return res.status(409).json({ message: "Serial number ini sudah terdaftar" });

  const { data, error } = await supabase.from("perangkat").insert({ id_perangkat, id_yayasan }).select().single();
  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(data);
});

router.patch("/:id/pairing", requireRole("administrator"), async (req, res) => {
  const { dipakai_oleh } = req.body;

  if (dipakai_oleh) {
    const { data: sudahDipakai } = await supabase
      .from("perangkat")
      .select("id_perangkat")
      .eq("dipakai_oleh", dipakai_oleh)
      .neq("id_perangkat", req.params.id)
      .single();

    if (sudahDipakai) {
      return res.status(409).json({
        message: `Pengguna ini sudah dipasangkan ke perangkat ${sudahDipakai.id_perangkat}. Lepas pemasangan itu dahulu.`,
      });
    }
  }

  const { data, error } = await supabase
    .from("perangkat")
    .update({ dipakai_oleh })
    .eq("id_perangkat", req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

router.delete("/:id", requireRole("administrator"), async (req, res) => {
  const { error } = await supabase.from("perangkat").delete().eq("id_perangkat", req.params.id);
  if (error) return res.status(400).json({ message: error.message });
  res.status(204).send();
});

export default router;