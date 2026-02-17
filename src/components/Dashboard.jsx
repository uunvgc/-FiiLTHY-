import { useState } from "react";

const API_BASE = "https://python-3-iy09.onrender.com";

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("");

  async function addSite() {
    try {
      const u = url.trim();
      if (!u) return setStatus("Enter a website (include https://)");
      if (!u.startsWith("http://") && !u.startsWith("https://")) {
        return setStatus("URL must start with https://");
      }

      setStatus("Adding site...");

      const res = await fetch(`${API_BASE}/v1/sites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u, name: u }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setStatus(`ADD FAILED: HTTP ${res.status} - ${data.detail || data.raw || "unknown error"}`);
        return;
      }

      // Backend returns { id, url, name }
      if (!data?.id) {
        setStatus(`ADD FAILED: Missing id -> ${JSON.stringify(data)}`);
        return;
      }

      setSiteId(data.id);
      setLeads([]);
      setStatus(`Site added ✅ id=${data.id}`);
    } catch (e) {
      setStatus(`ADD ERROR: ${e.message || String(e)}`);
    }
  }

  async function scanSite() {
    try {
      if (!siteId) return setStatus("Add site first");

      setStatus("Scanning...");

      const scanRes = await fetch(`${API_BASE}/v1/sites/${siteId}/scan`, { method: "POST" });
      const scanData = await safeJson(scanRes);

      if (!scanRes.ok) {
        setStatus(`SCAN FAILED: HTTP ${scanRes.status} - ${scanData.detail || scanData.raw || "unknown error"}`);
        return;
      }

      setStatus("Loading leads...");

      const leadsRes = await fetch(`${API_BASE}/v1/sites/${siteId}/leads`);
      const leadsData = await safeJson(leadsRes);

      if (!leadsRes.ok) {
        setStatus(`LEADS FAILED: HTTP ${leadsRes.status} - ${leadsData.detail || leadsData.raw || "unknown error"}`);
        return;
      }

      const leadList = Array.isArray(leadsData) ? leadsData : leadsData.leads || [];
      setLeads(leadList);
      setStatus(`Done ✅ ${leadList.length} leads found`);
    } catch (e) {
      setStatus(`SCAN ERROR: ${e.message || String(e)}`);
    }
  }

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20, fontFamily: "Arial" }}>
      <h1>FIILTHY</h1>

      <p style={{ color: "lime" }}>DASHBOARD VERSION: 1.0.7</p>
      <p style={{ color: "#aaa", marginTop: -6 }}>API: {API_BASE}</p>
      <p style={{ color: "#aaa", marginTop: -6 }}>siteId: {siteId || "(none yet)"}</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          style={{ padding: 10, width: 320 }}
        />
        <button onClick={addSite} style={{ padding: "10px 12px" }}>
          Add Site
        </button>
        <button onClick={scanSite} style={{ padding: "10px 12px" }}>
          Scan Site
        </button>
      </div>

      <div style={{ marginTop: 16, padding: 10, border: "1px solid #333" }}>
        {status || "Ready."}
      </div>

      <div style={{ marginTop: 16 }}>
        {leads.length === 0 ? (
          <p style={{ color: "#aaa" }}>No leads yet.</p>
        ) : (
          leads.map((lead, i) => (
            <div key={lead?.id || i} style={{ marginBottom: 12, padding: 10, border: "1px solid #333" }}>
              <div><b>{lead?.name || "Unknown"}</b></div>
              <div>Intent: {lead?.intent_score ?? "-"}</div>
              <div>FIILTHY: {lead?.fiilthy_score ?? "-"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
