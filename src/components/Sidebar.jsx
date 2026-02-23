import React from "react";
import { Link, useLocation } from "react-router-dom";

const nav = [
  { href: "/dashboard", label: "Vault Dashboard" },
  { href: "/leads", label: "Leads Vault" },
  { href: "/automations", label: "Automations" },
  { href: "/billing", label: "Billing" }
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <div className="badge">
          <span style={{ color: "var(--gold)", fontWeight: 900 }}>●</span>
          <span>Vault Mode</span>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.3 }}>
            Fii<span style={{ color: "var(--green)" }}>i</span>LTHY
          </div>
          <div className="sub">Lead intelligence in deposit boxes.</div>
        </div>
      </div>

      <div className="hr" />

      <div style={{ display: "grid", gap: 8 }}>
        {nav.map((x) => {
          const active = pathname === x.href;
          return (
            <Link
              key={x.href}
              to={x.href}
              className="btn"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: active ? "rgba(214,177,94,.38)" : undefined
              }}
            >
              <span style={{ fontWeight: 700 }}>{x.label}</span>
              <span style={{ color: "var(--muted)" }}>›</span>
            </Link>
          );
        })}
      </div>

      <div className="hr" />
      <Link to="/" className="btn btnGold">Public Landing</Link>
    </div>
  );
}
