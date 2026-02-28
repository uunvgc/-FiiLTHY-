// src/components/LeadCard.jsx
import React, { useMemo, useState } from "react";
import { aiDraftReply, aiRescore, updateLeadStatus } from "../lib/api.js";

export default function LeadCard({ lead, projectId, onChanged }) {
  const score = Number(lead?.score ?? 0);

  const badgeClass = useMemo(() => {
    if (score >= 80) return "badge good";
    if (score >= 50) return "badge mid";
    return "badge low";
  }, [score]);

  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState("");

  function flash(text, ms = 1200) {
    setMsg(text);
    if (ms) setTimeout(() => setMsg(""), ms);
  }

  async function copyLink() {
    const link = lead?.permalink || "";
    if (!link) return flash("No link", 1200);

    try {
      await navigator.clipboard.writeText(link);
      flash("Copied!");
    } catch {
      flash("Copy failed");
    }
  }

  async function setStatus(status) {
    setBusy(true);
    setMsg("");
    try {
      await updateLeadStatus({ lead_id: lead.id, status });
      flash("Saved", 1400);
      onChanged?.();
    } catch (e) {
      flash(e?.message || "Failed", 1800);
    } finally {
      setBusy(false);
    }
  }

  async function rescore() {
    setBusy(true);
    setMsg("");
    try {
      const out = await aiRescore({ lead_id: lead.id, project_id: projectId });
      flash(out?.message || "Rescored", 1400);
      onChanged?.();
    } catch (e) {
      flash(e?.message || "Rescore failed", 1800);
    } finally {
      setBusy(false);
    }
  }

  async function draftReply() {
    setBusy(true);
    setMsg("");
    try {
      const out = await aiDraftReply({ lead_id: lead.id, project_id: projectId });
      setDraft(out?.draft || out?.text || "");
      flash("Draft ready", 1400);
    } catch (e) {
      flash(e?.message || "Draft failed", 1800);
    } finally {
      setBusy(false);
    }
  }

  const content = lead?.content ? String(lead.content) : "";
  const preview =
    content.length > 300 ? content.slice(0, 300) + "…" : content || "(no content)";

  return (
    <div className="card">
      <div className="row">
        <div className="h2" style={{ margin: 0 }}>
          {lead?.title || "(no title)"}
        </div>
        <div className={badgeClass}>{score}</div>
      </div>

      <div className="muted" style={{ marginTop: 8 }}>
        {preview}
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <div className="muted">{lead?.source || ""}</div>

        <div className="row">
          {lead?.permalink ? (
            <a className="btn btn-link" href={lead.permalink} target="_blank" rel="noreferrer">
              Open
            </a>
          ) : null}
          <button className="btn" onClick={copyLink} disabled={!lead?.permalink}>
            Copy link
          </button>
        </div>
      </div>

      <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn" disabled={busy} onClick={() => setStatus("contacted")}>
          Mark Contacted
        </button>
        <button className="btn" disabled={busy} onClick={() => setStatus("ignored")}>
          Ignore
        </button>
        <button className="btn" disabled={busy} onClick={() => setStatus("won")}>
          Won
        </button>

        <button className="btn btn-primary" disabled={busy} onClick={draftReply}>
          AI Draft Reply
        </button>
        <button className="btn" disabled={busy} onClick={rescore}>
          AI Rescore
        </button>

        {msg ? <span className="pill">{msg}</span> : null}
      </div>

      {draft ? (
        <div style={{ marginTop: 12 }}>
          <div className="label">AI Draft</div>
          <textarea
            className="textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="row" style={{ marginTop: 10 }}>
            <button
              className="btn"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft);
                  flash("Draft copied");
                } catch {
                  flash("Copy failed");
                }
              }}
            >
              Copy draft
            </button>
            <button className="btn" onClick={() => setDraft("")}>
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
