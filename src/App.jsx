import { useState } from "react";
import { addSite, scanSite, getLeads } from "./api";

export default function App() {

  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [leads, setLeads] = useState([]);

  async function findLeads() {

    if (!url) return;

    const site = await addSite(url);

    setSiteId(site.site_id);

    await scanSite(site.site_id);

    const result = await getLeads(site.site_id);

    setLeads(result.leads);
  }

  return (

    <div style={{
      background: "#000",
      color: "#FFD700",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial"
    }}>

      <h1>FIILTHY</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter your website"
        style={{
          padding: "10px",
          width: "300px",
          background: "#111",
          color: "#FFD700",
          border: "1px solid #FFD700"
        }}
      />

      <button
        onClick={findLeads}
        style={{
          marginLeft: "10px",
          padding: "10px",
          background: "#FFD700",
          color: "#000",
          border: "none"
        }}
      >
        Find Customers
      </button>

      <div style={{ marginTop: "20px" }}>

        {leads.map((lead) => (

          <div key={lead.lead_id} style={{
            border: "1px solid #FFD700",
            padding: "10px",
            marginTop: "10px"
          }}>

            <h3>{lead.name}</h3>

            <p>FIILTHY Score: {lead.fiilthy_score}</p>

            <p>Intent Score: {lead.intent_score}</p>

          </div>

        ))}

      </div>

    </div>

  );
}
