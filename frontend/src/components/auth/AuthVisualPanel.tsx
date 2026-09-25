//frontend/src/components/auth/AuthVisualPanel.tsx

import { PersonStanding, TriangleAlert, MapPin, ShieldCheck, Users, Clock } from "lucide-react";

export function AuthVisualPanel({ tagline }: { tagline: string }) {
  return (
    <div className="relative hidden h-full w-full overflow-hidden rounded-[2.5rem] bg-secondary md:block">
      {/* Glow dekoratif */}
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-success/20 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between p-10">
        <p className="max-w-xs text-lg font-medium leading-snug text-white/90">{tagline}</p>

        {/* Ilustrasi: radar deteksi + pengguna */}
        <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
          <span className="absolute h-full w-full rounded-full border border-white/20 animate-radar" />
          <span className="absolute h-full w-full rounded-full border border-white/20 animate-radar" style={{ animationDelay: "0.8s" }} />
          <span className="absolute h-full w-full rounded-full border border-white/20 animate-radar" style={{ animationDelay: "1.6s" }} />

          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-modal">
            <PersonStanding size={34} className="text-secondary" />
          </div>

          <div className="absolute -left-2 top-3 flex h-11 w-11 animate-float items-center justify-center rounded-2xl bg-danger shadow-card">
            <TriangleAlert size={18} className="text-white" />
          </div>
          <div className="absolute -right-3 bottom-6 flex h-11 w-11 animate-float items-center justify-center rounded-2xl bg-primary shadow-card" style={{ animationDelay: "1s" }}>
            <MapPin size={18} className="text-white" />
          </div>
        </div>

        <div className="flex justify-between text-white/80">
          {[
            { icon: <ShieldCheck size={16} />, label: "Data terenkripsi" },
            { icon: <Users size={16} />, label: "Multi-yayasan" },
            { icon: <Clock size={16} />, label: "Real-time" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-xs">
              {b.icon}
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}