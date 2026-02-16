import { useEffect, useState } from "react";
import {
  addSite,
  scanSite,
  getLeads,
  setLeadStatus,
  trackEvent
} from "./api.js";

function App() {

  const [siteId, setSiteId] = useState(null);
  const [url, setUrl] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleAddSite() {
    if (!url) return;

    setLoading(true);

    try {
      const userId = "demo-user";
      const res = await addSite(userId, url, "gold");

      setSiteId(res.site_id);

      trackEvent("site_added", { url });

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function handleScan() {
    if (!siteId) return;

    setLoading(true);

    try {
      await scanSite(siteId);

      const leadsRes = await getLeads(siteId);

      setLeads(leadsRes.leads || []);

      trackEvent("scan_complete", { siteId });

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function handleStatus(leadId, status) {

    await setLeadStatus(siteId, leadId, status);

    const updated = leads.map(l =>
      l.lead_id === leadId ? { ...l, status } : l
    );

    setLeads(updated);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <h1>FIILTHY Dashboard</h1>

      <input
        placeholder="Enter site URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <button
        onClick={handleAddSite}
        style={{ padding: 10, marginLeft: 10 }}
      >
        Add Site
      </button>

      <button
        onClick={handleScan}
        disabled={!siteId}
        style={{ padding: 10, marginLeft: 10 }}
      >
        Scan
      </button>

      {loading && <p>Loading...</p>}

      <h2>Leads</h2>

      {leads.map((lead) => (
        <div
          key={lead.lead_id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10
          }}
        >
          <p>Name: {lead.name}</p>
          <p>Intent: {lead.intent_score}</p>
          <p>Score: {lead.fiilthy_score}</p>
          <p>Status: {lead.status || "new"}</p>

          <button onClick={() => handleStatus(lead.lead_id, "contacted")}>
            Contacted
          </button>

          <button onClick={() => handleStatus(lead.lead_id, "converted")}>
            Converted
          </button>

        </div>
      ))}

    </div>
  );
}

export default App;
