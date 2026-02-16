import { useEffect, useMemo, useState } from "react";
import { addSite, scanSite, getLeads, setLeadStatus, trackEvent } from "./api";

function getOrCreateUserId() {
  let id = localStorage.getItem("fiilthy_user_id");
  if (!id) {
    id = "u_" + Math.random().toString(16).slice(2);
    localStorage.setItem("fiilthy_user_id", id);
  }
  return id;
}

export default function App() {
  const userId = useMemo(getOrCreateUserId, []);
  const [url, setUrl] = useState("");
  const [plan, setPlan] = useState("gold");
  const [siteId, setSiteId] = useState(localStorage.getItem("fiilthy_site_id") || "");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const leads = data?.leads || [];

  async function connectAndScan() {
    setErr(""); setStatus(""); setLoading(true);
    try {
      if (!url.trim()) throw new Error("Paste a website URL.");
      setStatus("Linking site…");
      const s = await addSite(userId, url.trim(), plan);
      setSiteId(s.site_id);
      localStorage.setItem("fiilthy_site_id", s.site_id);

      setStatus("Scanning…");
      await scanSite(s.site_id);

      setStatus("Loading inbox…");
      const d = await getLeads(s.site_id);
      setData(d);
      setStatus("Locked.");
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function rescan() {
    setErr(""); setStatus(""); setLoading(true);
    try {
      if (!siteId) throw new Error("No site connected yet.");
      setStatus("Rescanning…");
      await scanSite(siteId);
      const d = await getLeads(siteId);
      setData(d);
      setStatus("Updated.");
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    if (!siteId) return;
    setLoading(true);
    try {
      const d = await getLeads(siteId);
      setData(d);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3 border-b border-yellow-700/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center font-black text-black"
                 style={{background:"linear-gradient(135deg,#FFD700,#B89600)", boxShadow:"0 0 18px rgba(255,215,0,.25)"}}>
              F
            </div>
            <div>
              <div className="font-black tracking-[0.25em]">FIILTHY</div>
              <div className="text-xs text-zinc-400">Customer Acquisition Engine</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-xl border border-yellow-400/60 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10 disabled:opacity-50"
              onClick={rescan}
              disabled={loading || !siteId}
            >
              Rescan
            </button>
            <button
              className="rounded-xl px-3 py-2 font-black text-black disabled:opacity-50"
              style={{background:"linear-gradient(135deg,#FFD700,#B89600)"}}
              onClick={connectAndScan}
              disabled={loading}
            >
              {loading ? "Working…" : "Find Customers"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-yellow-700/40 bg-zinc-950 p-4">
            <div className="font-black tracking-wider">Your Offer URL</div>
            <p className="mt-1 text-sm text-zinc-400">
              Paste your site. FIILTHY builds an intent fingerprint and feeds you leads.
            </p>

            <div className="mt-3">
              <input
                className="w-full rounded-xl border border-yellow-700/40 bg-black px-3 py-3 text-yellow-200 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-zinc-400">Plan</span>
              <select
                className="rounded-xl border border-yellow-700/40 bg-black px-2 py-2 text-yellow-200"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              >
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="crown">Crown</option>
              </select>
            </div>

            <div className="mt-3 rounded-xl border border-yellow-700/30 bg-black p-3 text-xs text-zinc-300">
              <div>userId: <span className="font-mono text-yellow-300">{userId}</span></div>
              <div className="mt-1">siteId: <span className="font-mono text-yellow-300">{siteId || "none"}</span></div>
            </div>

            {status && <div className="mt-3 text-yellow-300 text-sm">{status}</div>}
            {err && <div className="mt-3 text-red-400 text-sm">{err}</div>}

            {data && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat label="Leads" value={data.total} />
                <Stat label="Top" value={leads[0]?.fiilthy_score ?? "-"} />
                <Stat label="Scan" value={data.last_scan_at ? "Yes" : "No"} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-yellow-700/40 bg-zinc-950 p-4">
            <div className="font-black tracking-wider">Lead Inbox</div>
            <p className="mt-1 text-sm text-zinc-400">Sorted by FIILTHY Score. Highest wins first.</p>

            <div className="mt-3 flex flex-col gap-3">
              {leads.length === 0 ? (
                <div className="rounded-xl border border-yellow-700/40 border-dashed p-6 text-zinc-400">
                  No leads yet. Paste your URL and hit <b className="text-yellow-300">Find Customers</b>.
                </div>
              ) : (
                leads.map((l) => <LeadCard key={l.lead_id} lead={l} userId={userId} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-yellow-700/30 bg-black p-3">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-lg font-black text-yellow-300">{value}</div>
    </div>
  );
}

function LeadCard({ lead, userId }) {
  async function setStatus(status) {
    await setLeadStatus(lead.lead_id, status);
    await trackEvent(userId, lead.lead_id, status === "won" ? "won" : "contacted", { status });
    location.reload(); // quick MVP refresh (later: update state properly)
  }

  return (
    <div className="rounded-2xl border border-yellow-700/40 bg-gradient-to-b from-zinc-950 to-zinc-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-black">{lead.name}</div>
        <div className="rounded-full px-3 py-1 text-xs font-black text-black"
             style={{background:"linear-gradient(135deg,#FFD700,#B89600)"}}>
          FIILTHY {lead.fiilthy_score}
        </div>
      </div>

      <div className="mt-2 text-xs text-zinc-400">Status: <span className="text-yellow-300">{lead.status}</span></div>

      <div className="mt-3 grid gap-2">
        <Bar label="Intent" v={lead.intent_score} />
        <Bar label="Buy Window" v={lead.buy_window_score} />
        <Bar label="Contactability" v={lead.contactability_score} />
      </div>

      <div className="mt-3 text-xs text-zinc-400">
        {(lead.reasons || []).slice(0,3).map((r,i) => <div key={i}>✦ {r}</div>)}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-xl border border-yellow-400/60 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10"
                onClick={() => setStatus("contacted")}>
          Contacted
        </button>
        <button className="rounded-xl border border-yellow-400/60 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10"
                onClick={() => setStatus("booked")}>
          Booked
        </button>
        <button className="rounded-xl px-3 py-2 font-black text-black"
                style={{background:"linear-gradient(135deg,#FFD700,#B89600)"}}
                onClick={() => setStatus("won")}>
          Won
        </button>
        <button className="rounded-xl border border-red-400/60 px-3 py-2 text-red-300 hover:bg-red-400/10"
                onClick={() => setStatus("lost")}>
          Lost
        </button>
      </div>
    </div>
  );
}

function Bar({ label, v }) {
  const value = Math.max(0, Math.min(100, Number(v ?? 0)));
  return (
    <div className="grid grid-cols-[110px_1fr_36px] items-center gap-2">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="h-2 overflow-hidden rounded-full border border-yellow-700/30 bg-black">
        <div className="h-full" style={{width:`${value}%`, background:"linear-gradient(135deg,#FFD700,#B89600)"}} />
      </div>
      <div className="text-right text-xs font-black text-yellow-300">{value}</div>
    </div>
  );
              }
