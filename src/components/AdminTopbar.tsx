"use client";

export default function AdminTopbar({
  userEmail,
  onLogout,
}: {
  userEmail: string;
  onLogout: () => void;
}) {
  return (
    <header
      style={{
        padding: "14px 18px",
        borderBottom: "1px solid #2b2b2b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        position: "sticky",
        top: 0,
        background: "#0b0b0b",
        zIndex: 50,
      }}
    >
      <div>
        <div style={{ fontWeight: 900, letterSpacing: 0.5 }}>BAYR MANAGEMENT</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Leads Admin</div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ fontSize: 12, opacity: 0.8 }}>{userEmail}</div>
        <button
          onClick={onLogout}
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>
    </header>
  );
}
