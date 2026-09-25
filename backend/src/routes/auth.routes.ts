import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, nama_staf, nama_yayasan, no_wa, tipe_akun } = req.body;

  const isPerseorangan = tipe_akun === "perseorangan";

  if (!isPerseorangan && !nama_yayasan?.trim()) {
    return res.status(400).json({ message: "Nama yayasan wajib diisi" });
  }
  if (!nama_staf?.trim()) {
    return res.status(400).json({ message: "Nama lengkap wajib diisi" });
  }

  // Konversi string kosong ke null agar lolos check constraint no_wa di DB
  const noWaBersih: string | null = no_wa?.trim() || null;

  // Validasi format no_wa di awal, sebelum membuat apapun di DB
  if (noWaBersih && !/^\+62[0-9]{9,13}$/.test(noWaBersih)) {
    return res.status(400).json({ message: "Format nomor WhatsApp tidak valid. Gunakan format +62xxxxxxxxx" });
  }

  let idYayasan: string;
  let jadiAdministrator: boolean;

  if (isPerseorangan) {
    // Setiap akun perseorangan dapat tenant sendiri, otomatis jadi Administrator
    const { data: newYayasan, error: yayasanError } = await supabase
      .from("yayasan")
      .insert({ nama_yayasan: `${nama_staf.trim()} (Perseorangan)` })
      .select()
      .single();

    if (yayasanError || !newYayasan) {
      return res.status(400).json({ message: yayasanError?.message ?? "Gagal membuat akun perseorangan" });
    }
    idYayasan = newYayasan.id_yayasan;
    jadiAdministrator = true;
  } else {
    const { data: existingYayasan } = await supabase
      .from("yayasan")
      .select("id_yayasan")
      .ilike("nama_yayasan", nama_yayasan.trim())
      .maybeSingle();

    if (existingYayasan) {
      idYayasan = existingYayasan.id_yayasan;
      jadiAdministrator = false;
    } else {
      const { data: newYayasan, error: yayasanError } = await supabase
        .from("yayasan")
        .insert({ nama_yayasan: nama_yayasan.trim() })
        .select()
        .single();

      if (yayasanError || !newYayasan) {
        return res.status(400).json({ message: yayasanError?.message ?? "Gagal membuat yayasan" });
      }
      idYayasan = newYayasan.id_yayasan;
      jadiAdministrator = true;
    }
  }

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
      id_yayasan: idYayasan,
      no_wa: noWaBersih,
      role: jadiAdministrator ? "administrator" : "pengawas",
    })
    .select()
    .single();

  if (profileError) {
    await supabase.auth.admin.deleteUser(created.user.id);
    return res.status(400).json({ message: profileError.message });
  }

  res.status(201).json({
    message: isPerseorangan
      ? "Akun perseorangan berhasil dibuat"
      : jadiAdministrator
      ? "Akun berhasil dibuat sebagai Administrator yayasan baru"
      : "Akun berhasil dibuat sebagai Pengawas",
    id_admin: profile.id_admin,
    role: profile.role,
  });
});

export default router;