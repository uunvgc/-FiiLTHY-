import React, { useEffect, useMemo, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import Filters from "../components/Filters.jsx";
import LeadCard from "../components/LeadCard.jsx";
import { fetchLeads } from "../lib/api.js";

export default function Leads() {
  const projectId = (import.meta.env.VITE_FIILTHY_PROJECT_ID || "").trim();

  const [status, setStatus] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [intent, setIntent] = useState("");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);

  async function load() {
    try {
      setError("");

      if (!projectId) {
        setError("Missing VITE_FIILTHY_PROJECT_ID in env.");
        setLeads([]);
        return;
      }

      setLoading(true);

      const data = await fetchLeads({
        project_id: projectId,
        status,
        min_score: minScore,
        intent,
        limit: 200
      });

      setLeads(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, minScore, intent]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;

    return leads.filter((l) => {
      const hay = [l?.title, l?.content, l?.author, l?.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [leads, query]);

  return (
    <div className="container">
      <TopBar title="Leads Vault" />

      <Filters
        status={status}
        setStatus={setStatus}
        minScore={minScore}
        setMinScore={setMinScore}
        intent={intent}
        setIntent={setIntent}
        query={query}
        setQuery={setQuery}
        onRefresh={load}
      />

      {error ? (
        <div className="card card-error">
          <div className="h2">Error</div>
          <div className="muted" style={{ marginTop: 8 }}>
            {error}
          </div>
          <button className="btn" style={{ marginTop: 12 }} onClick={load}>
            Try again
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="card">
          <div className="h2">Loading leads…</div>
          <div className="muted" style={{ marginTop: 8 }}>
            Pulling from your backend.
          </div>
        </div>
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        <div className="card">
          <div className="h2">No leads found</div>
          <div className="muted" style={{ marginTop: 8 }}>
            Either your worker hasn’t inserted leads yet, or your filters are too tight.
          </div>
        </div>
      ) : null}

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
          />
        ))}
      </div>

      {!loading && !error && filtered.length > 0 ? (
        <div className="muted" style={{ marginTop: 12 }}>
          Showing {filtered.length} leads
        </div>
      ) : null}
    </div>
  );
}
