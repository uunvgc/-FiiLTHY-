import { useState } from "react";

const API_BASE = "https://python-3-iy09.onrender.com";

export default function Dashboard() {

  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("");

  async function addSite() {

    setStatus("Adding site...");

    const res = await fetch(`${API_BASE}/v1/sites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        name: url
      })
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed to add site");
      return;
    }

    setSiteId(data.site_id);

    setStatus("Site added ✅");
  }

  async function scanSite() {

    if (!siteId) {
      setStatus("Add site first");
      return;
    }

    setStatus("Scanning...");

    await fetch(`${API_BASE}/v1/sites/${siteId}/scan`, {
      method: "POST"
    });

    const res = await fetch(`${API_BASE}/v1/sites/${siteId}/leads`);

    const data = await res.json();

    // YOUR backend returns either:
    // { leads: [...] }
    // OR just [...]

    const leadList = data.leads || data;

    setLeads(leadList);

    setStatus(`Scan complete ✅ ${leadList.length} leads found`);
  }

  return (
    <div style={{
      background: "black",
      color: "white",
      minHeight: "100vh",
      padding: "20px"
    }}>

      <h1>FIILTHY</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="enter website"
        style={{
          padding: "10px",
          marginRight: "10px"
        }}
      />

      <button onClick={addSite}>
        Add Site
      </button>

      <br/><br/>

      <button onClick={scanSite}>
        Scan
      </button>

      <br/><br/>

      <div>{status}</div>

      <br/>

      {leads.map((lead) => (
        <div key={lead.lead_id} style={{marginBottom: "10px"}}>
          <div>{lead.name}</div>
          <div>Intent: {lead.intent_score}</div>
          <div>FIILTHY: {lead.fiilthy_score}</div>
        </div>
      ))}

    </div>
  );
}
