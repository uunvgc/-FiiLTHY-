const BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE ||
  ""
).trim();

function mustBase() {
  if (!BASE) throw new Error("Missing VITE_BACKEND_URL (or VITE_API_BASE)");
  return BASE;
}

async function request(path, opts = {}) {
  const res = await fetch(`${mustBase()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {})
    },
    ...opts
  });

  const text = await res.text().catch(() => "");
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(json?.error || `Request failed: ${res.status} ${text}`);
  }
  return json;
}

export async function fetchLeads({
  project_id,
  status = "",
  min_score = 0,
  intent = "",
  limit = 200
}) {
  const params = new URLSearchParams();
  params.set("project_id", project_id);
  params.set("limit", String(limit));
  if (status) params.set("status", status);
  if (min_score) params.set("min_score", String(min_score));
  if (intent) params.set("intent", intent);

  return request(`/leads?${params.toString()}`, { method: "GET" });
}

export async function updateLeadStatus({ lead_id, status }) {
  return request(`/leads/${lead_id}/status`, {
    method: "POST",
    body: JSON.stringify({ status })
  });
}

export async function aiDraftReply({ lead_id, project_id }) {
  return request(`/ai/draft-reply`, {
    method: "POST",
    body: JSON.stringify({ lead_id, project_id })
  });
}

export async function aiRescore({ lead_id, project_id }) {
  return request(`/ai/rescore`, {
    method: "POST",
    body: JSON.stringify({ lead_id, project_id })
  });
}
