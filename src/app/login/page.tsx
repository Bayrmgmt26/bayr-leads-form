"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Signing in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus("Success! Redirecting...");
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
      setStatus(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "80px auto" }}>
      <h1>Admin Login</h1>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button style={{ padding: 10, width: "100%" }}>
          Login
        </button>
      </form>

      <p>{status}</p>
    </main>
  );
}
