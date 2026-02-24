import React, { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import PaywallGate from "../components/PaywallGate";
import { apiFetch } from "../lib/api";

export default function Automations() {
  const [items, setItems] = useState([]);
  const [paywalled, setPaywalled] = useState(false);
  const [err, setErr] = useState(null);

  const [name, setName] = useState("Score ≥ 80 → Generate message");
  const [triggerValue, setTriggerValue] = useState("80");
  const [offer, setOffer] = useState("a quick idea to help you");

  async function load() {
    setErr(null);
    setPaywalled(false);
    try {
      const res = await apiFetch("/automations");
      setItems(res.items || []);
    } catch (e) {
      if (e.status === 402) setPaywalled(true);
      else setErr(e.message || "Failed to load automations");
    }
  }

  async function create() {
    setErr(null);
    setPaywalled(false);
    try {
      await apiFetch("/automations", {
        method: "POST",
        body: JSON.stringify({
          name,
          enabled: true,
          trigger_type: "score_threshold",
          trigger_value: triggerValue,
          action_type: "generate_message",
          action_value: offer
        })
      });
      await load();
    } catch (e) {
      if (e.status === 402) setPaywalled(true);
      else setErr(e.message || "Create failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <AppShell title="Automations" subtitle="Rules that run every 5 minutes.">
      <PaywallGate blocked={paywalled}>
        <div style={{ display: "grid", gap: 10 }}>
          <div className="row">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn btnGold" onClick={create}>Create</button>
          </div>

          <div className="row">
            <div style={{ flex: 1 }}>
              <div className="sub">Trigger (score threshold)</div>
              <input className="input" value={triggerValue} onChange={(e) => setTriggerValue(e.target.value)} />
            </div>
            <div style={{ flex: 2 }}>
              <div className="sub">Offer text used by AI</div>
              <input className="input" value={offer} onChange={(e) => setOffer(e.target.value)} />
            </div>
          </div>

          {err ? <div style={{ color: "var(--danger)" }}>{err}</div> : null}

          <div className="hr" />

          <div className="card" style={{ overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Trigger</th>
                  <th>Action</th>
                  <th>Enabled</th>
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.id}>
                    <td style={{ fontWeight: 900 }}>{x.name}</td>
                    <td>{x.trigger_type}: {x.trigger_value}</td>
                    <td>{x.action_type}</td>
                    <td><span className="badge">{x.enabled ? "ON" : "OFF"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PaywallGate>
    </AppShell>
  );
}
