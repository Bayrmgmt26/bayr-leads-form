"use client";

import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase";
import { useState } from "react";

const SERVICES = [
  { id: "drywall_patching_repair", label: "Drywall Patching & Repair" },
  { id: "door_lock_hardware", label: "Door, Lock & Hardware Fixes" },
  { id: "caulking_sealing", label: "Caulking & Sealing" },
  { id: "light_carpentry_trim", label: "Light Carpentry & Trim Work" },
  { id: "tv_mounting", label: "TV Mounting & Installations" },
  { id: "interior_painting", label: "Interior Painting" },
];

export default function Page() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [details, setDetails] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const submitLead = async () => {
  console.log("Submit clicked");

  if (!name || !phone || !zip || !serviceId) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    setStatusMsg("Saving...");

    console.log("Starting Firestore save...");

    const savePromise = addDoc(collection(db, "leads"), {
      leadName: name || "",
      source: "Website Form",
      serviceRequested: serviceId || "",
      phone: phone || "",
      email: "",
      location: zip || "",
      urgency: "Normal",
      estimatedValue: "Medium",
      notes: details || "",
      status: "new",
      createdAt: serverTimestamp(),
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore save timed out")), 10000)
    );

    await Promise.race([savePromise, timeoutPromise]);

    console.log("Firestore save finished");

    setStatusMsg("Lead submitted successfully!");

    setName("");
    setPhone("");
    setZip("");
    setServiceId("");
    setDetails("");
  } catch (error) {
    console.error("Submit failed:", error);
    setStatusMsg("Something went wrong. Check console.");
  } finally {
    setTimeout(() => {
      setStatusMsg("");
    }, 3000);
  }
};

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: 6 }}>BAYR MANAGEMENT LLC</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Handyman & Property Services — Request a Quote</p>

      {statusMsg && (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12 }}>
          {statusMsg}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <input
          placeholder="ZIP Code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="">Select a Service</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Job details (optional)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <button
          type="button"
          onClick={submitLead}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "12px",
            borderRadius: "10px",
            border: "1px solid #444",
            cursor: "pointer",
          }}
        >
          Submit Request
        </button>
      </div>
    </main>
  );
}
