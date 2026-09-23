"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-card bg-surface p-8 shadow-card">
        <h1 className="mb-6 text-xl font-semibold text-text-primary">Masuk ke PENUNTUN</h1>

        {error && (
          <div className="mb-4 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-input border border-border px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-text-secondary">Kata Sandi</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-input border border-border px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Memeriksa..." : "Masuk ke Dashboard"}
        </button>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Belum punya akun?{" "}
          <a href="/register" className="text-primary hover:underline">
            Daftar
          </a>
        </p>
      </form>
    </div>
  );
}