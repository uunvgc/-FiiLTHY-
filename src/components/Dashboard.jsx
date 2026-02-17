import { useMemo, useState } from "react";

const API_BASE = "https://python-3-iy09.onrender.com";

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(data?.detail || data?.raw || `HTTP ${res.status}`);
  }

  return data;
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const [busy, setBusy] = useState(false);

  const canAdd = useMemo(() => url.trim().length > 6 && !busy, [url, busy]);
  const canScan = useMemo(() => siteId.trim().length > 5 && !busy, [siteId, busy]);

  async function handleAddSite() {
    setError("");
    setStatus("");
    setLeads([]);
    setBusy(true);

    try {
      setStatus("Adding site...");
      const data = await api("/v1/sites", {
        method: "POST",
        body: JSON.stringify({
          url: url.trim(),
          name: url.trim(),
        }),
      });

      // backend returns: { success: true, site_id: "...", site: {...} }
      const newId = data?.site_id || data?.site?.id;
      if (!newId) throw new Error("No site_id returned from server.");

      setSiteId(newId);
      setStatus(`Site created ✅ (${newId})`);
    } catch (e) {
      setError(e.message || String(e));
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  async function handleScan() {
    setError("");
    setStatus("");
    setBusy(true);

    try {
      setStatus("Scanning site (can take a few seconds)...");
      await api(`/v1/sites/${siteId}/scan`, { method: "POST" });

      setStatus("Scan complete ✅ Loading leads...");
      const leadData = await api(`/v1/sites/${siteId}/leads`);

      const found = Array.isArray(leadData?.leads) ? leadData.leads : [];
      setLeads(found);
      setStatus(`Loaded ${found.length} leads ✅`);
    } catch (e) {
      setError(e.message || String(e));
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  async function handleRefreshLeads() {
    setError("");
    setStatus("");
    setBusy(true);

    try {
      setStatus("Refreshing leads...");
      const leadData = await api(`/v1/sites/${siteId}/leads`);
      const found = Array.isArray(leadData?.leads) ? leadData.leads : [];
      setLeads(found);
      setStatus(`Loaded ${found.length} leads ✅`);
    } catch (e) {
      setError(e.message || String(e));
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, Arial", maxWidth: 900 }}>
      <h1 style={{ margin: 0 }}>FIILTHY</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Backend: <code>{API_BASE}</code>
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (https://...)"
          style={{
            padding: 10,
            minWidth: 260,
            flex: 1,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAddSite}
          disabled={!canAdd}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #333",
            background: canAdd ? "#111" : "#666",
            color: "white",
          }}
        >
          {busy ? "Working..." : "Add Site"}
        </button>

        <button
          onClick={handleScan}
          disabled={!canScan}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #333",
            background: canScan ? "#111" : "#666",
            color: "white",
          }}
        >
          {busy ? "Working..." : "Scan"}
        </button>

        <button
          onClick={handleRefreshLeads}
          disabled={!canScan}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #333",
            background: canScan ? "#111" : "#666",
            color: "white",
          }}
        >
          Refresh Leads
        </button>
      </div>

      {siteId ? (
        <p style={{ marginTop: 10 }}>
          Current <b>site_id</b>: <code>{siteId}</code>
        </p>
      ) : null}

      {status ? (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "#eef" }}>
          {status}
        </div>
      ) : null}

      {error ? (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "#fee", color: "#900" }}>
          <b>Error:</b> {error}
          <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
            If you see “Site not found”, it means Render restarted and memory cleared — just hit Add Site again.
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <h2 style={{ marginBottom: 8 }}>Leads</h2>

        {leads.length === 0 ? (
          <div style={{ opacity: 0.8 }}>
            No leads loaded yet. Add a site → Scan → leads will appear here.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {leads.map((l, idx) => (
              <div
                key={idx}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                }}
              >
                <div style={{ fontWeight: 700 }}>{l.type || "lead"}</div>
                <div style={{ marginTop: 6, fontSize: 16 }}>
                  <code>{l.value}</code>
                </div>
                {l.source_url ? (
                  <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                    Source: {l.source_url}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
