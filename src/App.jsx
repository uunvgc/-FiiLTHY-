import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://python-3-iy09.onrender.com";

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

export default function App() {
  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  async function addSite() {
    setError("");
    setStatus("Adding site...");
    setLeads([]);

    try {
      if (!url.trim()) throw new Error("Enter a URL first.");

      const data = await api("/v1/sites", {
        method: "POST",
        body: JSON.stringify({ url: url.trim(), name: url.trim() }),
      });

      const id = data.site_id || data.id || data.siteId;
      if (!id) throw new Error("No site_id returned from backend.");

      setSiteId(id);
      setStatus(`Site added: ${id}`);
    } catch (e) {
      setError(e.message || "Add site failed");
      setStatus("Error");
    }
  }

  async function scan() {
    setError("");
    setStatus("Scanning...");

    try {
      if (!siteId) throw new Error("Add a site first (need a site_id).");

      await api(`/v1/sites/${siteId}/scan`, { method: "POST" });
      const data = await api(`/v1/sites/${siteId}/leads`);

      setLeads(Array.isArray(data) ? data : data.leads || []);
      setStatus("Scan complete ✅");
    } catch (e) {
      setError(e.message || "Scan failed");
      setStatus("Error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        padding: 18,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 34, letterSpacing: 1 }}>FIILTHY</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>Status: {status}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 10,
          marginTop: 14,
          maxWidth: 520,
        }}
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g. https://nike.com)"
          style={{
            width: "100%",
            padding: "14px 12px",
            fontSize: 16,
            borderRadius: 10,
            border: "1px solid #333",
            outline: "none",
          }}
        />

        <button
          onClick={addSite}
          style={{
            width: "100%",
            padding: "14px 12px",
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 12,
            border: "0",
            background: "#ffffff",
            color: "#000",
          }}
        >
          Add Site
        </button>

        <button
          onClick={scan}
          disabled={!siteId}
          style={{
            width: "100%",
            padding: "14px 12px",
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 12,
            border: "1px solid #444",
            background: siteId ? "#111" : "#111",
            color: siteId ? "#fff" : "#777",
          }}
        >
          Scan
        </button>

        {siteId ? (
          <div style={{ opacity: 0.85 }}>
            <div style={{ fontSize: 14 }}>Current site_id:</div>
            <div style={{ fontFamily: "monospace" }}>{siteId}</div>
          </div>
        ) : (
          <div style={{ opacity: 0.6, fontSize: 14 }}>
            Add a site to enable Scan.
          </div>
        )}

        {error ? (
          <div
            style={{
              background: "#2a0f0f",
              border: "1px solid #5a1f1f",
              padding: 12,
              borderRadius: 10,
              color: "#ffb3b3",
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: 18, maxWidth: 720 }}>
        <h2 style={{ marginBottom: 8 }}>Leads</h2>
        {leads.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No leads yet. Add Site → Scan.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {leads.map((l, idx) => (
              <div
                key={l.lead_id || idx}
                style={{
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {l.name || l.company || `Lead #${idx + 1}`}
                </div>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  intent_score: {l.intent_score ?? "—"} | fiilthy_score:{" "}
                  {l.fiilthy_score ?? "—"}
                </div>
                {l.email ? (
                  <div style={{ fontSize: 14, opacity: 0.85 }}>{l.email}</div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
      }
