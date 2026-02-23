import React from "react";
import { useAuth } from "../lib/auth";

export default function Topbar({ title, subtitle, right }) {
  const { user, signOut } = useAuth();

  return (
    <div className="row">
      <div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>{title}</div>
        {subtitle ? <div className="sub">{subtitle}</div> : null}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {right}
        <span className="badge">{user?.email || "—"}</span>
        <button className="btn" onClick={signOut}>Sign out</button>
      </div>
    </div>
  );
}
