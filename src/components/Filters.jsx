import React from "react";

export default function Filters({
  status,
  setStatus,
  minScore,
  setMinScore,
  intent,
  setIntent,
  query,
  setQuery
}) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Status</div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="ignored">ignored</option>
            <option value="won">won</option>
          </select>
        </div>

        <div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Intent</div>
          <select value={intent} onChange={(e) => setIntent(e.target.value)}>
            <option value="">All</option>
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>
        </div>

        <div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Min Score</div>
          <input
            className="input"
            type="number"
            value={minScore}
            min={0}
            max={100}
            onChange={(e) => setMinScore(Number(e.target.value || 0))}
          />
        </div>

        <div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Search</div>
          <input
            className="input"
            placeholder="title / content / author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
