"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import AdminTopbar from "@/components/AdminTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) router.replace("/login");
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminTopbar userEmail={user.email ?? ""} onLogout={handleLogout} />
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
export const metadata = {
  title: "Bayr Leads Dashboard",
  description: "Admin lead dashboard",
  manifest: "/manifest.webmanifest",
  themeColor: "#0b0f14",
};