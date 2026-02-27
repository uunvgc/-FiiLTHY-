import React, { useEffect, useMemo, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import Filters from "../components/Filters.jsx";
import LeadCard from "../components/LeadCard.jsx";
import { fetchLeads } from "../lib/api.js";

export default function LeadsPage() {
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
        limit: 200,
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
      <TopBar projectId={projectId} onRefresh={load} />

      <div style={{ display: "grid", gap: 12 }}>
        <Filters
          status={status}
          setStatus={setStatus}
          minScore={minScore}
          setMinScore={setMinScore}
          intent={intent}
          setIntent={setIntent}
          query={query}
          setQuery={setQuery}
        />

        {error ? (
          <div className="card" style={{ padding: 16, borderColor: "rgba(255,90,120,0.35)" }}>
            <div style={{ fontWeight: 800 }}>Error</div>
            <div className="muted" style={{ marginTop: 6 }}>{error}</div>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={load}>Try again</button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 800 }}>Loading leads…</div>
            <div className="muted" style={{ marginTop: 6 }}>Pulling from your backend.</div>
          </div>
        ) : null}

        {!loading && !error && filtered.length === 0 ? (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 800 }}>No leads found</div>
            <div className="muted" style={{ marginTop: 6 }}>
              Either your worker hasn’t inserted leads yet, or your filters are too tight.
            </div>
          </div>
        ) : null}

        <d
          iv className="grid">
          {filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>

        {!loading && !error && filtered.length > 0 ? (
          <div className="muted" style={{ padding: "8px 0 20px", fontSize: 12 }}>
            Showing {filtered.length} leads
          </div>
        ) : null}
      </div>
    </div>
  );
}
