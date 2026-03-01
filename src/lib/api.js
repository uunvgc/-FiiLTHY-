const BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE ||
  ""
).trim();

function mustBase() {
  if (!BASE) {
    throw new Error("Missing VITE_BACKEND_URL (or VITE_API_BASE)");
  }
  return BASE;
}

async function request(path, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch(`${mustBase()}${path}`, {
      signal: controller.signal,
      credentials: "include", // remove if you don't use cookies
      headers: {
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...(opts.headers || {})
      },
      ...opts
    });

    const text = await res.text().catch(() => "");
    let json = null;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // non-JSON response
    }

    if (!res.ok) {
      const msg =
        (json && (json.error || json.message)) ||
        (text ? text : `Request failed: ${res.status}`);
      throw new Error(msg);
    }

    return json;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/* =========================
   LEADS
========================= */

export async function fetchLeads({
  project_id,
  status = "",
  min_score,
  intent = "",
  limit = 200
}) {
  if (!project_id) {
    throw new Error("project_id is required");
  }

  const params = new URLSearchParams();
  params.set("project_id", project_id);
  params.set("limit", String(limit));

  if (status) params.set("status", status);
  if (min_score !== undefined && min_score !== null)
    params.set("min_score", String(min_score));
  if (intent) params.set("intent", intent);

  return request(`/leads?${params.toString()}`, {
    method: "GET"
  });
}

export async function updateLeadStatus({ lead_id, status }) {
  if (!lead_id) throw new Error("lead_id is required");
  if (!status) throw new Error("status is required");

  return request(`/leads/${lead_id}/status`, {
    method: "POST",
    body: JSON.stringify({ status })
  });
}

/* =========================
   AI
========================= */

export async function aiDraftReply({ lead_id, project_id }) {
  if (!lead_id || !project_id) {
    throw new Error("lead_id and project_id are required");
  }

  return request(`/ai/draft-reply`, {
    method: "POST",
    body: JSON.stringify({ lead_id, project_id })
  });
}

export async function aiRescore({ lead_id, project_id }) {
  if (!lead_id || !project_id) {
    throw new Error("lead_id and project_id are required");
  }

  return request(`/ai/rescore`, {
    method: "POST",
    body: JSON.stringify({ lead_id, project_id })
  });
}
