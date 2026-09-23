import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, nama_staf, id_yayasan, no_wa } = req.body;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return res.status(400).json({ message: createError?.message ?? "Registrasi gagal" });
  }

  const { data: profile, error: profileError } = await supabase
    .from("administrators")
    .insert({
      id_admin: created.user.id,
      email,
      nama_staf,
      id_yayasan,
      no_wa,
      role: "pengawas",
    })
    .select()
    .single();

  if (profileError) {
    await supabase.auth.admin.deleteUser(created.user.id);
    return res.status(400).json({ message: profileError.message });
  }

  res.status(201).json({ message: "Akun berhasil dibuat", id_admin: profile.id_admin });
});

export default router;