"use client";

import { useMemo, useState } from "react";
import StatsCards from "@/components/StatsCards";
import LeadTable from "@/components/LeadTable";
import LeadDrawer from "@/components/LeadDrawer";
import type { Lead, LeadStatus } from "@/types/leads";

export default function DashboardPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filters = useMemo(() => ({ statusFilter, search }), [statusFilter, search]);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Admin Dashboard</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>Live leads, status tracking, and quick actions.</p>

      <StatsCards />

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: 18,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, zip, service..."
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #333",
            minWidth: 280,
            flex: "1 1 280px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "ALL")}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #333" }}
        >
          <option value="ALL">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="scheduled">Scheduled</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <LeadTable filters={filters} onOpenLead={(lead) => setSelectedLead(lead)} />

      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </main>
  );
}
