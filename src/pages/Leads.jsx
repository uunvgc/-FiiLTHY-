import React, { useEffect, useMemo, useState } from "react";
import { fetchLeads } from "../lib/api.js";
import LeadCard from "../components/LeadCard.jsx";

export default function Leads({ projectId }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [intent, setIntent] = useState("");
  const [minScore, setMinScore] = useState(0);

  async function load() {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await fetchLeads({
        project_id: projectId,
        status,
        intent,
        min_score: minScore,
        limit: 200
      });
      setLeads(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [projectId, status, intent, minScore]);

  const filtered = useMemo(() => leads || [], [leads]);

  return (
    <div>
      <div className="row" style={{ marginBottom: 16 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="ignored">Ignored</option>
          <option value="won">Won</option>
        </select>

        <select value={intent} onChange={(e) => setIntent(e.target.value)}>
          <option value="">All Intent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <input
          type="number"
          placeholder="Min score"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value) || 0)}
        />
      </div>

      {loading ? <div>Loading...</div> : null}

      <div className="stack" style={{ marginTop: 12 }}>
        {filtered.map((lead) => (
          <LeadCard
            key={
              lead.id ||
              lead.source_id ||
              lead.permalink ||
              `${lead.source}-${lead.author}-${lead.posted_at}`
            }
            lead={lead}
            projectId={projectId}
            onChanged={load}
          />
        ))}
      </div>
    </div>
  );
}
