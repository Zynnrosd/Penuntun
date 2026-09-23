"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", nama_staf: "", id_yayasan: "", no_wa: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form onSubmit={handleRegister} className="w-full max-w-sm rounded-card bg-surface p-8 shadow-card">
        <h1 className="mb-6 text-xl font-semibold text-text-primary">Daftar Akun PENUNTUN</h1>

        {error && <div className="mb-4 rounded-input bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

        <label className="mb-1 block text-sm font-medium text-text-secondary">Nama Staf</label>
        <input
          required
          value={form.nama_staf}
          onChange={(e) => update("nama_staf", e.target.value)}
          className="mb-4 w-full rounded-input border border-border px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="mb-4 w-full rounded-input border border-border px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-text-secondary">Kata Sandi</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="mb-4 w-full rounded-input border border-border px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-text-secondary">ID Yayasan</label>
        <input
          required
          value={form.id_yayasan}
          onChange={(e) => update("id_yayasan", e.target.value)}
          placeholder="UUID yayasan"
          className="mb-4 w-full rounded-input border border-border px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-text-secondary">Nomor WhatsApp</label>
        <input
          value={form.no_wa}
          onChange={(e) => update("no_wa", e.target.value)}
          placeholder="+62..."
          className="mb-6 w-full rounded-input border border-border px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-input bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Mendaftarkan..." : "Buat Akun"}
        </button>
      </form>
    </div>
  );
}