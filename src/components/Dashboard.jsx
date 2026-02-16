import { useState } from "react";

export default function Dashboard() {

  const [siteId, setSiteId] = useState("");
  const [leads, setLeads] = useState([]);
  const [url, setUrl] = useState("");

  // IMPORTANT: must match your Vercel env variable exactly
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  async function createSite() {

    if (!url) {
      alert("Enter a URL");
      return;
    }

    try {

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

      setSiteId(data.site_id);

      alert("Site created successfully");

    } catch (err) {
      console.error(err);
      alert("Error creating site");
    }
  }

  async function scanSite() {

    if (!siteId) {
      alert("Create site first");
      return;
    }

    try {

      await fetch(`${API_BASE}/v1/sites/${siteId}/scan`, {
        method: "POST"
      });

      alert("Scan complete");

    } catch (err) {
      console.error(err);
      alert("Scan failed");
    }
  }

  async function loadLeads() {

    if (!siteId) {
      alert("Create site first");
      return;
    }

    try {

      const res = await fetch(`${API_BASE}/v1/sites/${siteId}/leads`);

      const data = await res.json();

      setLeads(data.leads || []);

    } catch (err) {
      console.error(err);
      alert("Failed to load leads");
    }
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>FIILTHY Dashboard</h1>

      <input
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={createSite}>Create Site</button>
      <button onClick={scanSite} style={{ marginLeft: "10px" }}>
        Scan Site
      </button>
      <button onClick={loadLeads} style={{ marginLeft: "10px" }}>
        Load Leads
      </button>

      <p>Site ID: {siteId}</p>

      <h3>Leads:</h3>

      {leads.map((lead) => (
        <div key={lead.lead_id} style={{
          border: "1px solid gray",
          padding: "10px",
          margin: "5px"
        }}>
          <p>Name: {lead.name}</p>
          <p>Intent Score: {lead.intent_score}</p>
          <p>FIILTHY Score: {lead.fiilthy_score}</p>
        </div>
      ))}

    </div>
  );
}
