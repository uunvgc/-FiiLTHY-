import React, { useState } from "react";
import { requireSupabase } from "../lib/supabase.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const sb = requireSupabase();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState("password"); // "password" | "magic"
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function signInPassword() {
    setLoading(true); setMsg("");
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      nav("/dashboard");
    } catch (e) {
      setMsg(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function signUp() {
    setLoading(true); setMsg("");
    try {
      const { error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      setMsg("Check your email to confirm, then login.");
    } catch (e) {
      setMsg(e?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function magicLink() {
    setLoading(true); setMsg("");
    try {
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
      setMsg("Magic link sent. Check your email.");
    } catch (e) {
      setMsg(e?.message || "Magic link failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
        <div className="h1">FIILTHY</div>
        <div className="muted" style={{ marginTop: 6 }}>
          Login to view high-intent leads instantly.
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <button className={"chip " + (mode === "password" ? "chip-on" : "")} onClick={() => setMode("password")}>
            Password
          </button>
          <button className={"chip " + (mode === "magic" ? "chip-on" : "")} onClick={() => setMode("magic")}>
            Magic Link
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="label">Email</div>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>

        {mode === "password" ? (
          <div style={{ marginTop: 12 }}>
            <div className="label">Password</div>
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </div>
        ) : null}

        {msg ? <div className="notice" style={{ marginTop: 14 }}>{msg}</div> : null}

        <div className="row" style={{ marginTop: 16 }}>
          {mode === "password" ? (
            <>
              <button className="btn btn-primary" disabled={loading} onClick={signInPassword}>
                {loading ? "Loading…" : "Login"}
              </button>
              <button className="btn" disabled={loading} onClick={signUp}>
                Create account
              </button>
            </>
          ) : (
            <button className="btn btn-primary" disabled={loading} onClick={magicLink}>
              {loading ? "Sending…" : "Send magic link"}
            </button>
          )}
        </div>

        <div className="muted" style={{ marginTop: 14, fontSize: 12 }}>
          If you get “Invalid login”, make sure Supabase Auth is enabled and you created the user.
        </div>
      </div>
    </div>
  );
}
