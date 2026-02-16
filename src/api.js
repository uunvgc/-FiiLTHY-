// src/App.jsx
import { useMemo, useState } from "react";
import { addSite, scanSite, getLeads, setLeadStatus, trackEvent } from "./api";

function getOrCreateUserId() {
  const key = "fiilthy_user_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `user_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function App() {
  const userId = useMemo(() => getOrCreateUserId(), []);

  const [url, setUrl] = useState("");
  const [plan, setPlan] = useState("gold");
  const [siteId, setSiteId] = useState("");
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleAddSite() {
    setError("");
    setMsg("");
    if (!url.trim()) {
      setError("Enter a website URL (example: nike.com)");
      return;
    }

    setLoading(true);
    try {
      trackEvent("add_site_clicked", { url, plan });
      const res = await addSite(userId, url.trim(), plan);
      setSiteId(res.site_id);
      setMsg(`✅ Site added. site_id: ${res.site_id}`);
    } catch (e) {
      setError(`❌ Add site failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleScan() {
    setError("");
    setMsg("");
    if (!siteId) {
      setError("No site_id yet. Add a site first.");
      return;
    }

    setLoading(true);
    try {
      trackEvent("scan_clicked", { siteId });
      const res = await scanSite(siteId);
      setMsg(`✅ Scan started. Added: ${res.added ?? "ok"}`);
    } catch (e) {
      setError(`❌ Scan failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetLeads() {
    setError("");
    setMsg("");
    if (!siteId) {
      setError("No site_id yet. Add a site first.");
      return;
    }

    setLoading(true);
    try {
      trackEvent("get_leads_clicked", { siteId });
      const res = await getLeads(siteId);

      // supports either: { leads: [...] } or { site_id, leads: [...] }
      const list = Array.isArray(res) ? res : (res.leads || []);
      setLeads(list);

      setMsg(`✅ Loaded ${list.length} leads`);
    } catch (e) {
      setError(`❌ Get leads failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleStatus(leadId, status) {
    // stub for now; later we’ll wire backend route
    setLeads((prev) =>
      prev.map((l) => (l.lead_id === leadId ? { ...l, status } : l))
    );
    setLeadStatus(siteId, leadId, status).catch(() => {});
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ margin: "8px 0" }}>FIILTHY</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Frontend (Vercel) → Backend (Render)
      </p>

      <div style={{ display: "grid", gap: 12, padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Website URL
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="nike.com"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Plan
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          >
            <option value="gold">gold</option>
            <option value="silver">silver</option>
            <option value="platinum">platinum</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={handleAddSite}
            disabled={loading}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff" }}
          >
            {loading ? "Working..." : "1) Add Site"}
          </button>

          <button
            onClick={handleScan}
            disabled={loading || !siteId}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#fff" }}
          >
            2) Scan
          </button>

          <button
            onClick={handleGetLeads}
            disabled={loading || !siteId}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#fff" }}
          >
            3) Get Leads
          </button>
        </div>

        <div style={{ fontSize: 14, opacity: 0.85 }}>
          <div><b>User:</b> {userId}</div>
          <div><b>Site ID:</b> {siteId || "—"}</div>
        </div>

        {msg && (
          <div style={{ padding: 10, borderRadius: 10, background: "#eaffea", border: "1px solid #b7f0b7" }}>
            {msg}
          </div>
        )}
        {error && (
          <div style={{ padding: 10, borderRadius: 10, background: "#ffecec", border: "1px solid #ffb3b3" }}>
            {error}
          </div>
        )}
      </div>

      <h2 style={{ marginTop: 20 }}>Leads</h2>
      {leads.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No leads yet. Add Site → Scan → Get Leads.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {leads.map((lead) => (
            <div
              key={lead.lead_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                display: "grid",
                gap: 6
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <b>{lead.name || `Lead ${lead.lead_id}`}</b>
                <span style={{ opacity: 0.7 }}>ID: {lead.lead_id}</span>
              </div>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 14 }}>
                <span>Intent: <b>{lead.intent_score ?? "—"}</b></span>
                <span>FIILTHY: <b>{lead.fiilthy_score ?? "—"}</b></span>
                <span>Status: <b>{lead.status ?? "new"}</b></span>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleStatus(lead.lead_id, "saved")}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #111", background: "#fff" }}
                >
                  Save
                </button>
                <button
                  onClick={() => handleStatus(lead.lead_id, "contacted")}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #111", background: "#fff" }}
                >
                  Contacted
                </button>
                <button
                  onClick={() => handleStatus(lead.lead_id, "ignored")}
                  style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #111", background: "#fff" }}
                >
                  Ignore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 26, fontSize: 12, opacity: 0.7 }}>
        Backend: {import.meta.env.VITE_API_BASE_URL || "(missing VITE_API_BASE_URL)"}
      </div>
    </div>
  );
  }
