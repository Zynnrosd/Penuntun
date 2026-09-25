//frontend/src/app/page.tsx

import Link from "next/link";
import {
  Compass, MapPin, Siren, ShieldCheck, Wifi, PersonStanding, TriangleAlert,
  Camera, Brain, Volume2, ArrowRight, Users, Home as HomeIcon,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-secondary text-white">
              <Compass size={18} />
            </div>
            <span className="text-lg font-bold text-secondary">PENUNTUN</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-text-secondary md:flex">
            <a href="#cara-kerja" className="hover:text-secondary">Cara Kerja</a>
            <a href="#fitur" className="hover:text-secondary">Fitur</a>
            <a href="#untuk-siapa" className="hover:text-secondary">Untuk Siapa</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-input px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary-soft">
              Masuk
            </Link>
            <Link href="/register" className="rounded-input bg-secondary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — asimetris, ilustrasi radar */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div className="animate-fade-up">
          <span className="mb-4 inline-block rounded-pill bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
             HIDUP JOKOWI
          </span>
          <h1 className="text-4xl font-bold leading-tight text-secondary md:text-5xl">
            Navigasi Cerdas untuk Kemandirian Tunanetra
          </h1>
          <p className="mt-5 max-w-md text-text-secondary">
            PENUNTUN mendeteksi rintangan secara real-time lewat tongkat pintar, dan memberi ketenangan bagi
            keluarga maupun yayasan lewat pemantauan lokasi langsung.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" className="group flex items-center gap-2 rounded-input bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
              Mulai Sekarang <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/login" className="rounded-input border border-border-strong px-6 py-3 text-sm font-semibold text-secondary hover:bg-secondary-soft">
              Sudah Punya Akun
            </Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div><div className="text-2xl font-bold text-secondary">3</div><div className="text-text-secondary">Jenis rintangan</div></div>
            <div><div className="text-2xl font-bold text-secondary">&lt;2s</div><div className="text-text-secondary">Respons suara</div></div>
            <div><div className="text-2xl font-bold text-secondary">24/7</div><div className="text-text-secondary">Pemantauan</div></div>
          </div>
        </div>

        {/* Ilustrasi radar */}
        <div className="relative mx-auto flex h-80 w-80 items-center justify-center">
          <span className="absolute h-full w-full rounded-full border border-primary/20 animate-radar" />
          <span className="absolute h-full w-full rounded-full border border-primary/20 animate-radar" style={{ animationDelay: "0.8s" }} />
          <span className="absolute h-full w-full rounded-full border border-primary/20 animate-radar" style={{ animationDelay: "1.6s" }} />

          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-secondary shadow-modal">
            <PersonStanding size={40} className="text-white" />
          </div>

          <div className="absolute left-4 top-6 flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-danger shadow-card">
            <TriangleAlert size={22} className="text-white" />
          </div>
          <div className="absolute right-2 top-16 flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-primary shadow-card" style={{ animationDelay: "1.2s" }}>
            <MapPin size={22} className="text-white" />
          </div>
          <div className="absolute bottom-4 left-16 flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-success shadow-card" style={{ animationDelay: "0.6s" }}>
            <Wifi size={22} className="text-white" />
          </div>
        </div>
      </section>

      {/* CARA KERJA — 3 langkah */}
      <section id="cara-kerja" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-secondary">Bagaimana PENUNTUN Bekerja</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-text-secondary">
          Tiga tahap sederhana dari deteksi rintangan sampai peringatan suara — semuanya diproses lokal, secara instan.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: <Camera size={22} />, judul: "Tangkap Visual", teks: "Kamera menangkap kondisi jalan di depan pengguna secara kontinu." },
            { icon: <Brain size={22} />, judul: "Deteksi AI Lokal", teks: "Model YOLOv8n mengidentifikasi lubang, tangga, dan kendaraan langsung di perangkat." },
            { icon: <Volume2 size={22} />, judul: "Peringatan Suara", teks: "Instruksi audio diberikan dalam Bahasa Indonesia sebelum pengguna menyentuh rintangan." },
          ].map((s, i) => (
            <div key={s.judul} className="relative rounded-card bg-surface p-6 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                {s.icon}
              </div>
              <div className="mb-1 text-xs font-semibold text-text-secondary">LANGKAH {i + 1}</div>
              <h3 className="mb-2 font-semibold text-text-primary">{s.judul}</h3>
              <p className="text-sm text-text-secondary">{s.teks}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-secondary">Fitur Utama Dashboard</h2>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { icon: <MapPin size={20} className="text-white" />, tone: "bg-primary", judul: "Lokasi Real-time", teks: "Pantau posisi pengguna secara live lewat GPS & peta interaktif." },
            { icon: <Siren size={20} className="text-white" />, tone: "bg-danger", judul: "Notifikasi SOS", teks: "Sinyal darurat langsung terkirim ke dashboard & WhatsApp." },
            { icon: <ShieldCheck size={20} className="text-white" />, tone: "bg-success", judul: "Geofencing", teks: "Peringatan otomatis saat pengguna keluar dari zona aman." },
            { icon: <Users size={20} className="text-white" />, tone: "bg-warning", judul: "Multi-Yayasan", teks: "Satu platform untuk banyak yayasan, data terisolasi aman." },
          ].map((f) => (
            <div key={f.judul} className="group rounded-card bg-surface p-6 shadow-card transition-transform hover:-translate-y-1">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-input ${f.tone}`}>{f.icon}</div>
              <h3 className="mb-1 font-semibold text-text-primary">{f.judul}</h3>
              <p className="text-sm text-text-secondary">{f.teks}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UNTUK SIAPA */}
      <section id="untuk-siapa" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-secondary">Untuk Siapa PENUNTUN?</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-card bg-surface p-8 shadow-card">
            <Users size={28} className="mb-3 text-primary" />
            <h3 className="mb-2 text-xl font-semibold text-text-primary">Yayasan & Organisasi</h3>
            <p className="mb-5 text-sm text-text-secondary">
              Kelola banyak pengguna dan perangkat sekaligus, dengan data yang terisolasi aman antar yayasan.
            </p>
            <Link href="/register?tipe=yayasan" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Daftarkan Yayasan <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-card bg-surface p-8 shadow-card">
            <HomeIcon size={28} className="mb-3 text-success" />
            <h3 className="mb-2 text-xl font-semibold text-text-primary">Keluarga & Perseorangan</h3>
            <p className="mb-5 text-sm text-text-secondary">
              Pantau anggota keluarga tunanetra secara pribadi, tanpa perlu bergabung dengan yayasan mana pun.
            </p>
            <Link href="/register?tipe=perseorangan" className="inline-flex items-center gap-1 text-sm font-semibold text-success hover:underline">
              Buat Akun Perseorangan <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-card bg-secondary px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-white">Mulai gunakan PENUNTUN hari ini</h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Gratis untuk mendaftar — baik untuk yayasan maupun keluarga perseorangan.
          </p>
          <Link href="/register" className="mt-6 inline-flex items-center gap-2 rounded-input bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
            Daftar Sekarang <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-text-secondary md:flex-row">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-secondary" />
            <span className="font-semibold text-secondary">PENUNTUN</span>
          </div>
          <p>© 2026 PENUNTUN — Althaf, Izac, Naufan</p>
        </div>
      </footer>
    </div>
  );
}