import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bayr Leads Dashboard",
  description: "Admin lead dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}