"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

type Lead = {
  id: string;
  name: string;
  phone: string;
  zip: string;
  serviceId: string;
  details?: string;
  status?: string;
  createdAt?: Timestamp;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const rows: Lead[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Lead, "id">),
      }));

      setLeads(rows);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await loadLeads();
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLeads([]);
  };

  useEffect(() => {
    if (user) loadLeads();
  }, [user]);

  // --------------------
  // LOGIN SCREEN
  // --------------------
  if (!user) {
    return (
      <main style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
        <h1>Admin Login</h1>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />

        <button onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </main>
    );
  }

  // --------------------
  // DASHBOARD SCREEN
  // --------------------
  return (
    <main style={{ padding: 24 }}>
      <h1>Leads Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>
      <button onClick={loadLeads} style={{ marginLeft: 10 }}>
        Refresh
      </button>

      {loading && <p>Loading...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div style={{ marginTop: 20 }}>
        {leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
            }}
          >
            <b>{lead.name}</b>
            <div>📞 {lead.phone}</div>
            <div>📍 {lead.zip}</div>
            <div>🛠 {lead.serviceId}</div>
            {lead.details && <div>📝 {lead.details}</div>}
          </div>
        ))}
      </div>
    </main>
  );
}
