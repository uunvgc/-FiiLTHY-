import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      nav("/dashboard", { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 36px)" }}>
      <div className="card" style={{ width: "min(520px, 94vw)" }}>
        <div className="card-inner">
          <div className="row">
            <div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>
                Fii<span style={{ color: "var(--green)" }}>i</span>LTHY Access
              </div>
              <div className="sub">Sign in to open your vault.</div>
            </div>
            <span className="badge">{mode === "signin" ? "Sign in" : "Create account"}</span>
          </div>

          <div className="hr" />

          <div style={{ display: "grid", gap: 10 }}>
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {err ? <div style={{ color: "var(--danger)" }}>{err}</div> : null}

            <button className="btn btnGold" onClick={submit} disabled={busy}>
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <button className="btn" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} disabled={busy}>
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
