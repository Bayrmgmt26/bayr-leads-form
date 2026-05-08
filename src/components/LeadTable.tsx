"use client";

import type { Lead } from "@/types/leads";

type Props = {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
};

export default function LeadTable({ leads, onSelectLead }: Props) {
  return (
    <div style={{ border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
      {leads.map((lead) => (
        <div
          key={lead.id}
          onClick={() => onSelectLead(lead)}
          style={{
            padding: 14,
            borderBottom: "1px solid #1f1f1f",
            cursor: "pointer",
            background: "#0b0b0b",
          }}
        >
          <strong>{lead.name}</strong> — {lead.service}
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            {lead.phone} • {lead.zip} • {lead.status}
          </div>
        </div>
      ))}
    </div>
  );
}
