import { useState } from "react";
import { addSite, scanSite, getLeads } from "./api.js";

function App() {
  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onAdd() {
    setMsg("");
    setLeads([]);

    const u = url.trim();
    if (!u) return setMsg("❌ Type a URL first (example.com)");

    setLoading(true);
    try {
      const res = await addSite("demo-user", u, "gold");
      const id = res.site_id || res.site?.site_id;
      setSiteId(id);
      setMsg(`✅ Added site: ${id}`);
    } catch (e) {
      setMsg(`❌ Add Site failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function onScan() {
    setMsg("");
    if (!siteId) return setMsg("❌ Add Site first.");

    setLoading(true);
    try {
      await scanSite(siteId);
      const res = await getLeads(siteId);
      setLeads(res.leads || []);
      setMsg(`✅ Scan done. Leads: ${(res.leads || []).length}`);
    } catch (e) {
      setMsg(`❌ Scan failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, background: "#000", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ marginTop: 0 }}>FIILTHY</h1>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          style={{ padding: 10, width: 280 }}
        />

        <button onClick={onAdd} style={{ padding: 10 }}>
          Add Site
        </button>

        <button onClick={onScan} style={{ padding: 10 }} disabled={!siteId}>
          Scan
        </button>
      </div>

      {loading && <p style={{ marginTop: 10 }}>Loading...</p>}
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

      <h2 style={{ marginTop: 18 }}>Leads</h2>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        leads.map((lead, i) => (
          <div key={i} style={{ border: "1px solid #333", padding: 10, marginBottom: 10 }}>
            <div><b>{lead.type || "lead"}</b></div>
            <div>{lead.value}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
