import React, { useState, useMemo } from "react";
import { apiFetch } from "../lib/api";

export default function LeadDrawer({ lead, onClose }) {
  const [offer, setOffer] = useState("a quick idea to help you get better results");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const title = useMemo(() => lead.full_name || lead.handle || "Lead", [lead]);

  async function gen() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await apiFetch("/messaging/generate", {
        method: "POST",
        body: JSON.stringify({ lead_id: lead.id, offer })
      });
      setMsg(res.message);
    } catch (e) {
      setErr(e.message || "Failed to generate");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="drawerBackdrop" onMouseDown={onClose}>
      <div className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="row">
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{title}</div>
            <div className="sub">
              {lead.platform || "—"} • Score{" "}
              <span style={{ color: "var(--green)", fontWeight: 900 }}>{lead.score ?? 0}</span>{" "}
              • {lead.intent_level || "—"}
            </div>
          </div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>

        <div className="hr" />

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <div className="sub">Profile</div>
            {lead.profile_url ? (
              <a className="btn" href={lead.profile_url} target="_blank" rel="noreferrer">
                Open Profile ↗
              </a>
            ) : (
              <div className="badge">No URL</div>
            )}
          </div>

          <div>
            <div className="sub">Notes</div>
            <div className="badge" style={{ width: "fit-content" }}>{lead.notes || "—"}</div>
          </div>

          <div className="hr" />

          <div>
            <div style={{ fontWeight: 900 }}>AI DM Generator</div>
            <div className="sub">Premium tone. Short. Respectful. One question.</div>

            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <input className="input" value={offer} onChange={(e) => setOffer(e.target.value)} />
              <button className="btn btnGold" onClick={gen} disabled={busy}>
                {busy ? "Generating…" : "Generate DM"}
              </button>

              {err ? <div style={{ color: "var(--danger)" }}>{err}</div> : null}

              {msg ? (
                <div className="card" style={{ borderColor: "rgba(45,255,106,.25)" }}>
                  <div className="card-inner">
                    <div className="sub">Generated message</div>
                    <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{msg}</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
