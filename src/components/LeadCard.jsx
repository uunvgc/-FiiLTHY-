import React, { useMemo, useState } from "react";
import { aiDraftReply, aiRescore, updateLeadStatus } from "../lib/api.js";

export default function LeadCard({ lead, projectId = "", onChanged }) {
  const score = Number(lead?.score ?? 0);
  const badge = useMemo(() => {
    if (score >= 80) return "badge good";
    if (score >= 50) return "badge mid";
    return "badge low";
  }, [score]);

  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState("");

  const leadId = lead?.id;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(lead?.permalink || "");
      setMsg("Copied!");
      setTimeout(() => setMsg(""), 1200);
    } catch {
      setMsg("Copy failed");
      setTimeout(() => setMsg(""), 1200);
    }
  }

  async function setStatus(status) {
    if (!leadId) {
      setMsg("Missing lead id");
      setTimeout(() => setMsg(""), 1400);
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      await updateLeadStatus({ lead_id: leadId, status });
      setMsg("Saved");
      onChanged?.();
    } catch (e) {
      setMsg(e?.message || "Failed");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 1400);
    }
  }

  async function rescore() {
    if (!leadId) {
      setMsg("Missing lead id");
      setTimeout(() => setMsg(""), 1400);
      return;
    }
    if (!projectId) {
      setMsg("Missing projectId");
      setTimeout(() => setMsg(""), 1400);
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      const out = await aiRescore({ lead_id: leadId, project_id: projectId });
      setMsg(out?.message || "Rescored");
      onChanged?.();
    } catch (e) {
      setMsg(e?.message || "Rescore failed");
    } finally {
      setBusy(false);
    }
  }

  async function draftReply() {
    if (!leadId) {
      setMsg("Missing lead id");
      setTimeout(() => setMsg(""), 1400);
      return;
    }
    if (!projectId) {
      setMsg("Missing projectId");
      setTimeout(() => setMsg(""), 1400);
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      const out = await aiDraftReply({ lead_id: leadId, project_id: projectId });
      setDraft(out?.draft || out?.text || "");
      setMsg("Draft ready");
    } catch (e) {
      setMsg(e?.message || "Draft failed");
    } finally {
      setBusy(false);
    }
  }

  const content = lead?.content ? String(lead.content) : "";
  const contentPreview =
    content.length > 300 ? content.slice(0, 300) + "…" : (content || "(no content)");

  return (
    <div className="card">
      <div className="row">
        <div className="h2" style={{ margin: 0 }}>
          {lead?.title || "(no title)"}
        </div>
        <div className={badge}>{score}</div>
      </div>

      <div className="muted" style={{ marginTop: 8 }}>
        {contentPreview}
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
          <textarea className="textarea" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="row" style={{ marginTop: 10 }}>
            <button
              className="btn"
              onClick={async () => {
                await navigator.clipboard.writeText(draft);
                setMsg("Draft copied");
                setTimeout(() => setMsg(""), 1200);
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
