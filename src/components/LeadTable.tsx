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
          <span style={{
  marginLeft: 8,
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  background:
    lead.priority === "hot" ? "#b8962e" :
    lead.priority === "warm" ? "#3a2f12" :
    "#1f2937",
  color:
    lead.priority === "hot" ? "#0b2a4a" :
    "white",
}}>
  {(lead.priority || "normal").toUpperCase()}
</span>

          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
            {lead.location || "No location"} • {lead.source || "Unknown source"} • {lead.status || "new"} • {lead.priority || "normal"}
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