import React from "react";
import { requireSupabase } from "../lib/supabase.js";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title = "FIILTHY", onRefresh }) {
  const sb = requireSupabase();
  const nav = useNavigate();

  return (
    <div className="topbar">
      <div>
        <div className="brand">FIILTHY</div>
        <div className="muted" style={{ marginTop: 6 }}>{title}</div>
      </div>

      <div className="row">
        {onRefresh ? <button className="btn" onClick={onRefresh}>Refresh</button> : null}
        <button className="btn" onClick={() => nav("/dashboard")}>Dashboard</button>
        <button className="btn" onClick={async () => { await sb.auth.signOut(); nav("/login"); }}>
          Logout
        </button>
      </div>
    </div>
  );
}
