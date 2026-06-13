"use client";

import type { Lead } from "@/types/leads";

type Props = {
  lead: Lead | null;
  onClose: () => void;
};

export default function LeadDrawer({ lead, onClose }: Props) {
  if (!lead) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: 360,
        height: "100vh",
        background: "#0b0b0b",
        borderLeft: "1px solid #222",
        padding: 20,
        zIndex: 9999,
      }}
    >
      <button
        onClick={onClose}
        style={{
          marginBottom: 12,
          background: "#111",
          border: "1px solid #222",
          color: "white",
          padding: "6px 10px",
          borderRadius: 8,
        }}
      >
        Close
      </button>

     <h2>{lead.notes?.split(" | ")[0] || lead.customerName || lead.name || "Lead Details"}</h2>

<p><strong>Service:</strong> {lead.service || "N/A"}</p>
<p><strong>Location:</strong> {lead.location || lead.zip || "N/A"}</p>
<p><strong>Source:</strong> {lead.source || "N/A"}</p>
<p><strong>Status:</strong> {lead.status || "new"}</p>

{lead.sourceUrl && (
  <p>
    <strong>Original Post:</strong>{" "}
    <a
      href={
        lead.sourceUrl.startsWith("http")
          ? lead.sourceUrl
          : `https://philadelphia.craigslist.org${lead.sourceUrl}`
      }
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#b8962e",
        textDecoration: "underline",
        fontWeight: 700,
      }}
    >
      Open Craigslist Lead
    </a>
  </p>
)}</div>
)}