//frontend/src/app/(auth)/register/page.tsx

"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api-client";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const awal = searchParams.get("tipe") === "perseorangan" ? "perseorangan" : "yayasan";

  const [tipeAkun, setTipeAkun] = useState<"yayasan" | "perseorangan">(awal);
  const [form, setForm] = useState({ email: "", password: "", nama_staf: "", nama_yayasan: "", no_wa: "" });
  const [lihatPassword, setLihatPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ message: string }>("/auth/register", { ...form, tipe_akun: tipeAkun });
      setInfo(res.message);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-4 md:grid-cols-2 md:p-6">
      <div className="flex items-center justify-center overflow-y-auto py-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-secondary text-white">
              <Compass size={18} />
            </div>
            <span className="text-lg font-bold text-secondary">PENUNTUN</span>
          </div>

          <h1 className="text-2xl font-bold text-text-primary">Buat Akun Baru</h1>
          <p className="mb-5 text-sm text-text-secondary">Pilih jenis akun sesuai kebutuhan Anda</p>

          <div className="mb-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipeAkun("yayasan")}
              className={`rounded-input border px-3 py-2 text-sm font-medium transition-colors ${
                tipeAkun === "yayasan" ? "border-primary bg-primary-soft text-primary" : "border-border text-text-secondary"
              }`}
            >
              Yayasan
            </button>
            <button
              type="button"
              onClick={() => setTipeAkun("perseorangan")}
              className={`rounded-input border px-3 py-2 text-sm font-medium transition-colors ${
                tipeAkun === "perseorangan" ? "border-primary bg-primary-soft text-primary" : "border-border text-text-secondary"
              }`}
            >
              Perseorangan
            </button>
          </div>

          {error && <div className="mb-4 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}
          {info && <div className="mb-4 rounded-input bg-success-soft px-3 py-2 text-sm text-success">{info}</div>}

          <form onSubmit={handleRegister}>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Nama Lengkap</label>
            <input
              required
              value={form.nama_staf}
              onChange={(e) => update("nama_staf", e.target.value)}
              placeholder="Naufan Rosada"
              className="mb-3 w-full rounded-input border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />

            {tipeAkun === "yayasan" && (
              <>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Nama Yayasan</label>
                <input
                  required
                  value={form.nama_yayasan}
                  onChange={(e) => update("nama_yayasan", e.target.value)}
                  placeholder="Yayasan Komunitas Sahabat Mata"
                  className="mb-1 w-full rounded-input border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <p className="mb-3 text-xs text-text-secondary">
                  Yayasan baru → Anda jadi Administrator. Sudah terdaftar → Anda jadi Pengawas.
                </p>
              </>
            )}

            {tipeAkun === "perseorangan" && (
              <p className="mb-3 rounded-input bg-primary-soft px-3 py-2 text-xs text-primary">
                Cocok untuk keluarga/pendamping pribadi tanpa naungan yayasan.
              </p>
            )}

            <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="nama@gmail.com"
              className="mb-3 w-full rounded-input border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />

            <label className="mb-1 block text-sm font-medium text-text-secondary">Kata Sandi</label>
            <div className="relative mb-3">
              <input
                type={lihatPassword ? "text" : "password"}
                required
                minLength={6}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-input border border-border px-3 py-2.5 pr-10 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setLihatPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
              >
                {lihatPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label className="mb-1 block text-sm font-medium text-text-secondary">Nomor WhatsApp</label>
            <input
              value={form.no_wa}
              onChange={(e) => update("no_wa", e.target.value)}
              placeholder="+6281234567890"
              className="mb-5 w-full rounded-input border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-input bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "Mendaftarkan..." : "Buat Akun"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-text-secondary">
            Sudah punya akun?{" "}
            <a href="/login" className="font-medium text-primary hover:underline">
              Masuk
            </a>
          </p>
        </div>
      </div>

      <AuthVisualPanel tagline="Setiap langkah yang lebih aman, dimulai dari satu akun." />
    </div>
  );
}