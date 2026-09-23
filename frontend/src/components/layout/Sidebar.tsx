"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/cn";

const MENU_UMUM = [
  { href: "/home", label: "Home" },
  { href: "/monitoring", label: "Monitoring Lokasi" },
  { href: "/baterai", label: "Status Baterai" },
  { href: "/notifikasi", label: "Notifikasi SOS" },
];

const MENU_MANAJEMEN = [
  { href: "/perangkat", label: "Kelola Data Perangkat" },
  { href: "/pengguna", label: "Kelola Data Pengguna" },
  { href: "/pengaturan/whatsapp", label: "Konfigurasi Notifikasi" },
];

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const manajemenAktif = MENU_MANAJEMEN.some((m) => pathname.startsWith(m.href));
  const [terbuka, setTerbuka] = useState(manajemenAktif);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-secondary text-on-dark">
      <div className="px-5 py-6 text-lg font-bold">PENUNTUN</div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {MENU_UMUM.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-input px-3 py-2 text-sm",
              pathname === item.href ? "bg-primary-soft text-primary font-medium" : "text-on-dark/80 hover:bg-white/5"
            )}
          >
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <div className="mt-2">
            <button
              onClick={() => setTerbuka((v) => !v)}
              className={cn(
                "flex w-full items-center justify-between rounded-input px-3 py-2 text-sm",
                manajemenAktif ? "bg-primary-soft text-primary font-medium" : "text-on-dark/80 hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-2">
                <Settings size={16} />
                Manajemen
              </span>
              <ChevronDown size={16} className={cn("transition-transform", terbuka && "rotate-180")} />
            </button>

            {terbuka && (
              <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                {MENU_MANAJEMEN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-input px-3 py-2 text-sm",
                      pathname === item.href
                        ? "bg-primary-soft text-primary font-medium"
                        : "text-on-dark/70 hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="m-3 rounded-input px-3 py-2 text-left text-sm text-on-dark/70 hover:bg-white/5"
      >
        Keluar
      </button>
    </aside>
  );
}