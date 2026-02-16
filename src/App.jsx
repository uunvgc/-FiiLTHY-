import { useState } from "react";
import { addSite, scanSite, getLeads } from "./services/api";

export default function App() {
  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [leads, setLeads] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onAdd() {
    setMsg("");
    setLeads([]);

    const u = url.trim();
    if (!u) return setMsg("❌ Type a website url first.");

    try {
      setLoading(true);

      // backend expects: { url, name }
      const res = await addSite("user", u, "gold");
      const id = res?.site_id || res?.id || res?.siteId;

      if (!id) {
        setMsg("❌ Backend did not return a site_id.");
        return;
      }

      setSiteId(id);
      setMsg(`✅ Site added: ${id}`);
    } catch (e) {
      setMsg(`❌ Add failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function onScan() {
    setMsg("");
    setLeads([]);

    if (!siteId) return setMsg("❌ Add a site first.");

    try {
      setLoading(true);
      await scanSite(siteId);
      setMsg("✅ Scan started. Loading leads...");

      const data = await getLeads(siteId);
      const list = data?.leads || data || [];
      setLeads(Array.isArray(list) ? list : []);
      setMsg(`✅ Leads loaded: ${Array.isArray(list) ? list.length : 0}`);
    } catch (e) {
      setMsg(`❌ Scan/Leads failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function onRefreshLeads() {
    setMsg("");
    setLeads([]);

    if (!siteId) return setMsg("❌ Add a site first.");

    try {
      setLoading(true);
      const data = await getLeads(siteId);
      const list = data?.leads || data || [];
      setLeads(Array.isArray(list) ? list : []);
      setMsg(`✅ Leads refreshed: ${Array.isArray(list) ? list.length : 0}`);
    } catch (e) {
      setMsg(`❌ Refresh failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ margin: 0 }}>FIILTHY</h1>
      <p style={{ marginTop: 6, opacity: 0.8 }}>
        Add a website → scan it → view leads.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          style={{
            padding: 10,
            minWidth: 260,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={onAdd}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #000",
            background: loading ? "#ddd" : "#000",
            color: loading ? "#333" : "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Working..." : "Add Site"}
        </button>

        <button
          onClick={onScan}
          disabled={loading || !siteId}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #000",
            background: loading || !siteId ? "#ddd" : "#000",
            color: loading || !siteId ? "#333" : "#fff",
            cursor: loading || !siteId ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Working..." : "Scan + Load Leads"}
        </button>

        <button
          onClick={onRefreshLeads}
          disabled={loading || !siteId}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #000",
            background: loading || !siteId ? "#ddd" : "#fff",
            color: "#000",
            cursor: loading || !siteId ? "not-allowed" : "pointer",
          }}
        >
          Refresh Leads
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>
          <b>Site ID:</b> {siteId || "—"}
        </div>

        {msg && (
          <div
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fafafa",
              marginTop: 8,
              whiteSpace: "pre-wrap",
            }}
          >
            {msg}
          </div>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <h2 style={{ marginBottom: 10 }}>Leads</h2>

        {leads.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No leads yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {leads.map((lead, i) => (
              <div
                key={lead?.lead_id || lead?.id || i}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {lead?.name || lead?.company || `Lead ${i + 1}`}
                </div>

                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                  ID: {lead?.lead_id || lead?.id || "—"}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                  <span>Intent: <b>{lead?.intent_score ?? "—"}</b></span>
                  <span>Fiilthy: <b>{lead?.fiilthy_score ?? "—"}</b></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
