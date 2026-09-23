import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth, requireRole, getSession } from "../lib/auth";

const router = Router();
router.use(requireAuth, requireRole("administrator"));

router.patch("/whatsapp", async (req, res) => {
  const { id } = getSession(req);
  const { no_wa } = req.body;
  if (!/^\+62\d{9,13}$/.test(no_wa)) {
    return res.status(400).json({ message: "Nomor harus diawali +62 dan berisi 9–13 digit" });
  }
  const { data, error } = await supabase.from("administrators").update({ no_wa }).eq("id_admin", id).select().single();
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

export default router;