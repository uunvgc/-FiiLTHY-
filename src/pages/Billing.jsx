import React, { useState } from "react";
import AppShell from "../components/AppShell";
import { apiFetch } from "../lib/api";

export default function Billing() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function checkout() {
    setBusy(true);
    setErr(null);
    try {
      const res = await apiFetch("/billing/checkout", {
        method: "POST",
        body: JSON.stringify({})
      });
      window.location.href = res.url;
    } catch (e) {
      setErr(e.message || "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <AppShell title="Billing" subtitle="Unlock paywalled features: AI messaging + automations + leads.">
      <div style={{ display: "grid", gap: 12 }}>
        <div className="card">
          <div className="card-inner">
            <div className="row">
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>FiiLTHY Vault Subscription</div>
                <div className="sub">Stripe checkout → webhook updates your subscription status.</div>
              </div>
              <button className="btn btnGold" onClick={checkout} disabled={busy}>
                {busy ? "Redirecting…" : "Subscribe"}
              </button>
            </div>
            {err ? <div style={{ marginTop: 10, color: "var(--danger)" }}>{err}</div> : null}
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div style={{ fontWeight: 900 }}>After you subscribe</div>
            <div className="sub">
              Go back to Leads Vault and Automations — paywall opens once your webhook updates the DB.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
