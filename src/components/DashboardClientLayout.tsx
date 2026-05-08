"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import AdminTopbar from "@/components/AdminTopbar";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  async function handleSignOut() {
    await signOut(auth);
    router.push("/login");
  }

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
  <>
    <AdminTopbar
      userEmail={user?.email || ""}
      onLogout={handleSignOut}
    />

    {children}
  </>
);
}