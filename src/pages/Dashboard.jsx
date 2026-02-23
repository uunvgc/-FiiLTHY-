import React, { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { apiFetch } from "../lib/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const m = await apiFetch("/metrics");
        setMetrics(m);
      } catch (e) {
        setErr(e.message || "Metrics unavailable (add /metrics on API)");
      }
    })();
  }, []);

  return (
    <AppShell
      title="Vault Dashboard"
      subtitle="Totals, status, and last scan."
      right={<Link className="btn btnGold" to="/leads">Open Leads</Link>}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <div className="row">
          <span className="badge">API: {import.meta.env.VITE_API_BASE_URL ? "Connected" : "Missing env"}</span>
          <a className="btn" href={`${import.meta.env.VITE_API_BASE_URL || ""}/health`} target="_blank" rel="noreferrer">
            API Health ↗
          </a>
        </div>

        <div className="hr" />

        <div className="row">
          <div>
            <div style={{ fontWeight: 900 }}>Scanner status</div>
            <div className="sub">
              {metrics?.last_scan?.ts ? `Last scan: ${metrics.last_scan.ts}` : (err || "No /metrics yet")}
            </div>
          </div>
        </div>

        <div className="hr" />

        <div className="row">
          <div className="card" style={{ flex: 1 }}><div className="card-inner"><div className="sub">Total</div><div style={{ fontSize: 28, fontWeight: 900 }}>{metrics?.total ?? "—"}</div></div></div>
          <div className="card" style={{ flex: 1 }}><div className="card-inner"><div className="sub">New</div><div style={{ fontSize: 28, fontWeight: 900 }}>{metrics?.new ?? "—"}</div></div></div>
          <div className="card" style={{ flex: 1 }}><div className="card-inner"><div className="sub">Contacted</div><div style={{ fontSize: 28, fontWeight: 900 }}>{metrics?.contacted ?? "—"}</div></div></div>
          <div className="card" style={{ flex: 1 }}><div className="card-inner"><div className="sub">Qualified</div><div style={{ fontSize: 28, fontWeight: 900 }}>{metrics?.qualified ?? "—"}</div></div></div>
        </div>
      </div>
    </AppShell>
  );
}
