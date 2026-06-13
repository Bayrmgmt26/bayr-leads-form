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
          <strong>
            {lead.notes?.split(" | ")[0] || lead.customerName || lead.name || lead.service || "Untitled Lead"}
          </strong>

          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
            {lead.location || "No location"} • {lead.source || "Unknown source"} • {lead.status || "new"}
          </div>

          {lead.sourceUrl && (
            <div style={{ fontSize: 12, marginTop: 6, opacity: 0.75 }}>
              {lead.sourceUrl}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}