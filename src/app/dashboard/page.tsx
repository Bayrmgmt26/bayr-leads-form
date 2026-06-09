"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardClientLayout from "@/components/DashboardClientLayout";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

import StatsCards from "@/components/StatsCards";
import LeadTable from "@/components/LeadTable";
import LeadDrawer from "@/components/LeadDrawer";
import type { Lead, LeadStatus } from "@/types/leads";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const rows = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Lead, "id">;
        return { id: doc.id, ...data };
      });

      setLeads(rows);
    });

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return leads.filter((l: any) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : l.status === statusFilter;

      const haystack = [
        l.customerName,
        l.name,
        l.phone,
        l.email,
        l.zip,
        l.city,
        l.service,
        l.location,
        l.notes,
        l.source,
        l.sourceUrl,
        l.details ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = s.length === 0 ? true : haystack.includes(s);

      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, search]);

  return (
    <DashboardClientLayout>
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 16,
          background: "#0b2a4a",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                color: "#b8962e",
              }}
            >
              Bayr Management Lead Engine
            </h1>

            <p style={{ marginTop: 6, opacity: 0.8 }}>
              Automated Lead Generation • OpenClaw • Firestore • DigitalOcean
            </p>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <StatsCards leads={leads} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 14,
            alignItems: "center",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, city, service, source..."
            style={{
              flex: "1 1 280px",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #b8962e",
              background: "#12385f",
              color: "white",
              outline: "none",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as LeadStatus | "ALL")
            }
            style={{
              flex: "0 0 200px",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #b8962e",
              background: "#12385f",
              color: "white",
              outline: "none",
            }}
          >
            <option value="ALL">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #b8962e",
              background: "#b8962e",
              color: "#0b2a4a",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <LeadTable leads={filtered} onSelectLead={setSelectedLead} />
        </div>

        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      </main>
    </DashboardClientLayout>
  );
}