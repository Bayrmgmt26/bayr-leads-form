"use client";

import { useEffect, useMemo, useState } from "react";

type PushStatus =
  | "idle"
  | "needs-permission"
  | "denied"
  | "ready"
  | "subscribing"
  | "subscribed"
  | "error";

export default function EnablePush() {
  const [status, setStatus] = useState<PushStatus>("idle");
  const [msg, setMsg] = useState<string>("");

  const supported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
  }, []);

  useEffect(() => {
    if (!supported) {
      setStatus("error");
      setMsg("Push notifications are not supported in this browser.");
      return;
    }

    // Initialize based on current permission
    const perm = Notification.permission; // "default" | "granted" | "denied"
    if (perm === "granted") {
      setStatus("ready");
      setMsg("Notifications are allowed. You can enable push.");
    } else if (perm === "denied") {
      setStatus("denied");
      setMsg("Notifications are blocked. Enable them in browser settings.");
    } else {
      setStatus("needs-permission");
      setMsg("Click to allow notifications.");
    }
  }, [supported]);

  async function requestPermission() {
    try {
      setMsg("");

      const permission = await Notification.requestPermission(); // "granted" | "denied" | "default"

      if (permission === "granted") {
        setStatus("ready");
        setMsg("Permission granted. Now click “Enable Push”.");
      } else if (permission === "denied") {
        setStatus("denied");
        setMsg("Notifications blocked.");
      } else {
        setStatus("needs-permission");
        setMsg("Permission not granted yet.");
      }
    } catch (e) {
      setStatus("error");
      setMsg("Permission request failed.");
    }
  }

  async function enablePush() {
    try {
      setStatus("subscribing");
      setMsg("Registering device…");

      // Make sure SW is ready
      const reg = await navigator.serviceWorker.ready;

      // VAPID public key comes from env (must start with NEXT_PUBLIC_)
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidKey) {
        setStatus("error");
        setMsg("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env.local");
        return;
      }

      // Convert base64 url-safe to Uint8Array
      const key = urlBase64ToUint8Array(vapidKey);

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      });

      // Send subscription to your backend API route (we’ll create this next)
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      if (!res.ok) {
        const text = await res.text();
        setStatus("error");
        setMsg(`Subscribe API failed: ${text}`);
        return;
      }

      setStatus("subscribed");
      setMsg("✅ Push enabled. You’ll get alerts for new leads.");
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message || "Failed to enable push.");
    }
  }

  return (
    <div
      style={{
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: 14,
        background: "#121212",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700 }}>Notifications</div>
          <div style={{ opacity: 0.8, fontSize: 13 }}>{msg}</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {status === "needs-permission" && (
            <button
              onClick={requestPermission}
              style={btnStyle}
            >
              Allow
            </button>
          )}

          {(status === "ready" || status === "idle") && (
            <button
              onClick={enablePush}
              style={btnStyle}
            >
              Enable Push
            </button>
          )}

          {status === "subscribed" && (
            <span style={{ fontSize: 13, opacity: 0.9 }}>✅ Enabled</span>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  border: "1px solid #333",
  borderRadius: 10,
  padding: "10px 14px",
  background: "#1b1b1b",
  color: "#fff",
  cursor: "pointer",
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
