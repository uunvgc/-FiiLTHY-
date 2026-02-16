import { useEffect, useMemo, useState } from "react";

const API_BASE = "https://python-3-iy09.onrender.com";

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
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

async function addSite(url) {
  // backend expects: { url, name }
  return api("/v1/sites", {
    method: "POST",
    body: JSON.stringify({ url, name: url })
  });
}

async function scanSite(siteId) {
  return api(`/v1/sites/${siteId}/scan`, { method: "POST" });
}

async function getLeads(siteId) {
  return api(`/v1/sites/${siteId}/leads`);
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState(localStorage.getItem("fiilthy_site_id") || "");
  const [status, setStatus] = useState("idle"); // idle | loading | scanning | error
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const [lastScan, setLastScan] = useState(localStorage.getItem("fiilthy_last_scan") || "");

  const canScan = useMemo(() => !!siteId && status !== "scanning" && status !== "loading", [siteId, status]);

  async function loadLeads(id = siteId) {
    if (!id) return;
    setError("");
    setStatus("loading");
    try {
      const data = await getLeads(id);

      // backend might return {leads:[...]} or just [...]
      const list = Array.isArray(data) ? data : (data?.leads || []);
      setLeads(list);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e.message || "Failed to load leads.");
    }
  }

  async function handleAddSite() {
    const cleaned = url.trim();
    if (!cleaned) return;

    setError("");
    setStatus("loading");
    try {
      const data = await addSite(cleaned);

      const id = data?.site_id || data?.id || "";
      if (!id) throw new Error("Backend did not return a site_id.");

      setSiteId(id);
      localStorage.setItem("fiilthy_site_id", id);

      setUrl("");
      setStatus("idle");

      // load leads right away (might be empty until scanned)
      await loadLeads(id);
    } catch (e) {
      setStatus("error");
      setError(e.message || "Failed to add site.");
    }
  }

  async function handleScan() {
    if (!siteId) return;

    setError("");
    setStatus("scanning");
    try {
      await scanSite(siteId);

      const stamp = new Date().toLocaleString();
      setLastScan(stamp);
      localStorage.setItem("fiilthy_last_scan", stamp);

      // after scan, reload leads
      await loadLeads(siteId);

      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e.message || "Scan failed.");
    }
  }

  function handleReset() {
    localStorage.removeItem("fiilthy_site_id");
    localStorage.removeItem("fiilthy_last_scan");
    setSiteId("");
    setLastScan("");
    setLeads([]);
    setUrl("");
    setError("");
    setStatus("idle");
  }

  useEffect(() => {
    if (siteId) loadLeads(siteId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui, Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>FIILTHY</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
            Add a site → Scan → View leads
          </p>
        </div>

        <button
          onClick={handleReset}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer"
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: 18, padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
        <h2 style={{ margin: "0 0 10px", fontSize: 16 }}>1) Add your website</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              flex: 1,
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none"
            }}
          />

          <button
            onClick={handleAddSite}
            disabled={status === "loading" || status === "scanning"}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              cursor: "pointer",
              opacity: status === "loading" || status === "scanning" ? 0.6 : 1
            }}
          >
            {status === "loading" ? "Adding..." : "Add Site"}
          </button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
          <div><b>Site ID:</b> {siteId || "—"}</div>
          <div><b>Last Scan:</b> {lastScan || "—"}</div>
        </div>

        <div style={{ marginTop: 14 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 16 }}>2) Scan</h2>

          <button
            onClick={handleScan}
            disabled={!canScan}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #0b5",
              background: "#0b5",
              color: "white",
              cursor: "pointer",
              opacity: canScan ? 1 : 0.55
            }}
          >
            {status === "scanning" ? "Scanning..." : "Scan Site"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "#fff1f1", border: "1px solid #ffd3d3" }}>
            <b style={{ color: "#b00" }}>Error:</b> {error}
          </div>
        )}
      </div>

      <div style={{ marginTop: 18, padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16 }}>3) Leads</h2>

          <button
            onClick={() => loadLeads(siteId)}
            disabled={!siteId || status === "loading" || status === "scanning"}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              opacity: !siteId || status === "loading" || status === "scanning" ? 0.6 : 1
            }}
          >
            Refresh
          </button>
        </div>

        <p style={{ marginTop: 8, opacity: 0.75 }}>
          Total: <b>{leads.length}</b>
        </p>

        {leads.length === 0 ? (
          <div style={{ padding: 14, borderRadius: 12, background: "#fafafa", border: "1px dashed #ddd" }}>
            No leads yet. Add a site and run a scan.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {leads.map((lead, idx) => (
              <div
                key={lead.lead_id || lead.id || idx}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid #eee",
                  background: "white"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {lead.name || lead.company || "Lead"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    ID: {lead.lead_id || lead.id || "—"}
                  </div>
                </div>

                <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Badge label="Intent" value={lead.intent_score} />
                  <Badge label="Fiilthy" value={lead.fiilthy_score} />
                  {lead.email && <Badge label="Email" value={lead.email} />}
                  {lead.phone && <Badge label="Phone" value={lead.phone} />}
                </div>

                {lead.notes && (
                  <div style={{ marginTop: 10, opacity: 0.85 }}>
                    {lead.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ label, value }) {
  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #eee",
        background: "#fafafa",
        fontSize: 12
      }}
    >
      <b>{label}:</b> {value ?? "—"}
    </div>
  );
}
