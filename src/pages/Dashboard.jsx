import React, { useEffect, useState } from "react";
import { requireSupabase } from "../lib/supabase.js";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";

export default function Dashboard() {
  const sb = requireSupabase();
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setEmail(data?.user?.email || ""));
  }, [sb]);

  return (
    <div className="container">
      <TopBar title="Dashboard" />

      <div className="card">
        <div className="h2">Welcome</div>
        <div className="muted" style={{ marginTop: 6 }}>Logged in as: <strong>{email || "—"}</strong></div>

        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => nav("/leads")}>Open Leads</button>
          <button className="btn" onClick={async () => { await sb.auth.signOut(); nav("/login"); }}>
            Logout
          </button>
        </div>

        <div className="muted" style={{ marginTop: 14 }}>
          Tip: If leads are empty, check your backend worker + project_id.
        </div>
      </div>
    </div>
  );
}
