"use client";

import type { Lead } from "@/types/leads";

type Props = {
  leads: Lead[];
};

export default function StatsCards({ leads }: Props) {
  const total = leads.length;
  const newLeads = leads.filter(l => l.status === "NEW").length;
  const contacted = leads.filter(l => l.status === "CONTACTED").length;
  const scheduled = leads.filter(l => l.status === "SCHEDULED").length;

  const cardStyle: React.CSSProperties = {
    background: "#0f0f0f",
    border: "1px solid #222",
    padding: 16,
    borderRadius: 12,
    flex: 1,
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <div style={cardStyle}><strong>Total</strong><div>{total}</div></div>
      <div style={cardStyle}><strong>New</strong><div>{newLeads}</div></div>
      <div style={cardStyle}><strong>Contacted</strong><div>{contacted}</div></div>
      <div style={cardStyle}><strong>Scheduled</strong><div>{scheduled}</div></div>
    </div>
  );
}
