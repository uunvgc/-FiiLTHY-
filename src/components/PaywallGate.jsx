import React from "react";
import { Link } from "react-router-dom";

export default function PaywallGate({ blocked, children }) {
  if (!blocked) return children;

  return (
    <div className="card">
      <div className="card-inner">
        <div className="row">
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Unlock the Vault</div>
            <div className="sub">This feature is behind the paywall.</div>
          </div>
          <Link className="btn btnGold" to="/billing">Open Billing</Link>
        </div>
      </div>
    </div>
  );
}
