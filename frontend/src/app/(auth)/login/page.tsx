//frontend/src/app/(auth)/login/page.tsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email atau kata sandi salah");
      return;
    }
    router.push("/home");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-4 md:grid-cols-2 md:p-6">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-secondary text-white">
              <Compass size={18} />
            </div>
            <span className="text-lg font-bold text-secondary">PENUNTUN</span>
          </div>

          <h1 className="text-2xl font-bold text-text-primary">Selamat Datang Kembali</h1>
          <p className="mb-6 text-sm text-text-secondary">Masuk untuk melanjutkan pemantauan</p>

          {error && <div className="mb-4 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@gmail.com"
              className="mb-4 w-full rounded-input border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />

            <label className="mb-1 block text-sm font-medium text-text-secondary">Kata Sandi</label>
            <div className="relative mb-2">
              <input
                type={lihatPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-input bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "Memeriksa..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Belum punya akun?{" "}
            <a href="/register" className="font-medium text-primary hover:underline">
              Daftar
            </a>
          </p>
        </div>
      </div>

      <AuthVisualPanel tagline="Pantau langkah mereka dengan tenang — di mana pun, kapan pun." />
    </div>
  );
}