"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [siap, setSiap] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const { data: admin } = await supabase
        .from("administrators")
        .select("role")
        .eq("id_admin", data.session.user.id)
        .single();
      setIsAdmin(admin?.role === "administrator");
      setSiap(true);
    });
  }, [router]);

  if (!siap) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}