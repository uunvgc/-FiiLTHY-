import { useEffect, useState } from "react";
import { getHealth, addSite, scanSite, getLeads } from "../services/api";

export default function Dashboard() {
  const [health, setHealth] = useState(null);

  const [userId, setUserId] = useState("demo-user-1");
  const [url, setUrl] = useState("https://example.com");
  const [plan, setPlan] = useState("gold");

  const [siteId, setSiteId] = useState("");
  const [status, setStatus] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refreshHealth() {
    try {
      const data = await getHealth();
      setHealth(data);
    } catch (e) {
      setHealth({ error: String(e?.message || e) });
    }
  }

  useEffect(() => {
    refreshHealth();
  }, []);

  async function handleAddSite() {
    setLoading(true);
    setStatus("Adding site...");
    setLeads([]);

    try {
      const data = await addSite(userId, url, plan);
      const newSiteId = data?.site_id || data?.id || "";
      setSiteId(newSiteId);
      setStatus(`✅ Site added. site_id: ${newSiteId}`);
    } catch (e) {
      setStatus(`❌ Add site failed: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleScan() {
    if (!siteId) {
      setStatus("❌ No site_id yet. Add a site first.");
      return;
    }

    setLoading(true);
    setStatus("Scanning site...");
    setLeads([]);

    try {
      await scanSite(siteId);
      setStatus("✅ Scan complete. Fetching leads...");

      const leadData = await getLeads(siteId);
      setLeads(Array.isArray(leadData) ? leadData : (leadData?.leads || []));
      setStatus("✅ Leads loaded.");
    } catch (e) {
      setStatus(`❌ Scan/Get leads failed: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: 6 }}>FIILTHY Dashboard</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Add a website → scan it → pull leads from your backend.
      </p>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700 }}>Backend status</div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              {health ? <pre style={{ margin: 0 }}>{JSON.stringify(health, null, 2)}</pre> : "Checking..."}
            </div>
          </div>
          <button onClick={refreshHealth} disabled={loading} style={{ padding: "10px 14px" }}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Inputs</div>

          <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>Website URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          >
            <option value="gold">gold</option>
            <option value="silver">silver</option>
            <option value="starter">starter</option>
          </select>

          <button
            onClick={handleAddSite}
            disabled={loading}
            style={{ padding: "10px 14px", width: "100%", marginBottom: 10 }}
          >
            Add Site
          </button>

          <button
            onClick={handleScan}
            disabled={loading}
            style={{ padding: "10px 14px", width: "100%" }}
          >
            Scan + Get Leads
          </button>

          <div style={{ marginTop: 10, fontSize: 14 }}>
            <div><b>Current site_id:</b> {siteId || "(none yet)"}</div>
          </div>

          <div style={{ marginTop: 10, fontSize: 14 }}>
            <b>Status:</b> {status || "(ready)"}
          </div>
        </div>

        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Leads</div>

          {loading && <div>Loading...</div>}

          {!loading && leads.length === 0 && (
            <div style={{ opacity: 0.75 }}>
              No leads yet. Click <b>Scan + Get Leads</b>.
            </div>
          )}

          {!loading && leads.length > 0 && (
            <div style={{ display: "grid", gap: 10 }}>
              {leads.map((l, i) => (
                <div
                  key={l.lead_id || i}
                  style={{ padding: 10, border: "1px solid #eee", borderRadius: 10 }}
                >
                  <div style={{ fontWeight: 700 }}>{l.name || "Lead"}</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    lead_id: {l.lead_id}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>
                    intent_score: <b>{l.intent_score}</b> • fiilthy_score: <b>{l.fiilthy_score}</b>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
