import { useState } from "react";

export default function Dashboard() {

  const [siteId, setSiteId] = useState("");
  const [leads, setLeads] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  async function createSite() {

    const res = await fetch(`${API_BASE}/v1/sites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: "demo_user",
        url: "https://example.com",
        plan: "gold"
      })
    });

    const data = await res.json();

    setSiteId(data.site_id);
  }

  async function scanSite() {

    const res = await fetch(`${API_BASE}/v1/sites/${siteId}/scan`, {
      method: "POST"
    });

    await res.json();

    loadLeads();
  }

  async function loadLeads() {

    const res = await fetch(`${API_BASE}/v1/sites/${siteId}/leads`);

    const data = await res.json();

    setLeads(data.leads || []);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>FIILTHY Dashboard</h1>

      <button onClick={createSite}>
        Create Site
      </button>

      <button onClick={scanSite} disabled={!siteId}>
        Scan Site
      </button>

      <h2>Leads:</h2>

      {leads.map((lead) => (
        <div key={lead.lead_id}>
          {lead.name} — Score: {lead.fiilthy_score}
        </div>
      ))}

    </div>
  );
}
