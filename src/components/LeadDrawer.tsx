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

      <h2>{lead.name}</h2>
      <p><strong>Phone:</strong> {lead.phone}</p>
      <p><strong>Zip:</strong> {lead.zip}</p>
      <p><strong>Service:</strong> {lead.service}</p>
      {lead.details && <p><strong>Details:</strong> {lead.details}</p>}
      <p><strong>Status:</strong> {lead.status}</p>
    </div>
  );
}
