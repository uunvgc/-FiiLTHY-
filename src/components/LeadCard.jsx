import React from "react";

export default function LeadCard({ lead }) {
  const score = Number(lead?.score ?? 0);

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 800 }}>{lead?.title || "(no title)"}</div>
        <div className="badge">{score}</div>
      </div>

      {lead?.content ? (
        <div className="muted" style={{ marginTop: 10 }}>
          {String(lead.content).slice(0, 280)}
          {String(lead.content).length > 280 ? "…" : ""}
        </div>
      ) : (
        <div className="muted" style={{ marginTop: 10 }}>(no content)</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12 }}>
        <span className="muted">{lead?.source || ""}</span>
        {lead?.permalink ? (
          <a href={lead.permalink} target="_blank" rel="noreferrer">View Post →</a>
        ) : (
          <span className="muted">No link</span>
        )}
      </div>
    </div>
  );
}
