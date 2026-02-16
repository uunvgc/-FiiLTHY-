import { useState } from "react";
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

  async function handleAddSite() {

    const res = await addSite("demo-user", url, "gold");

    setSiteId(res.site_id);

    trackEvent("site_added", { url });
  }

  async function handleScan() {

    await scanSite(siteId);

    const res = await getLeads(siteId);

    setLeads(res.leads || []);
  }

  async function handleStatus(leadId, status) {

    await setLeadStatus(siteId, leadId, status);

    setLeads(
      leads.map(l =>
        l.lead_id === leadId ? { ...l, status } : l
      )
    );
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>FIILTHY</h1>

      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Enter URL"
      />

      <button onClick={handleAddSite}>
        Add Site
      </button>

      <button onClick={handleScan}>
        Scan
      </button>

      {leads.map(lead => (
        <div key={lead.lead_id}>

          <p>{lead.name}</p>

          <button onClick={() =>
            handleStatus(lead.lead_id, "contacted")
          }>
            Contacted
          </button>

        </div>
      ))}

    </div>
  );
}

export default App;
