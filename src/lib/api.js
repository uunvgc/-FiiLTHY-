/* ================================
   CONFIG
================================ */

const BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE ||
  ""
).trim();

if (!BASE) {
  throw new Error("Missing VITE_BACKEND_URL (or VITE_API_BASE)");
}

const DEFAULT_TIMEOUT = 15000; // 15 seconds
const USE_COOKIES = true; // set to false if using JWT instead


/* ================================
   CORE REQUEST WRAPPER
================================ */

async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    timeout = DEFAULT_TIMEOUT
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      signal: controller.signal,
      credentials: USE_COOKIES ? "include" : "same-origin",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers
      },
      ...(body ? { body } : {})
    });

    const raw = await res.text().catch(() => "");
    let data = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw || null;
    }

    if (!res.ok) {
      const message =
        (data && (data.error || data.message)) ||
        raw ||
        `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}


/* ================================
   LEADS API
================================ */

export async function fetchLeads({
  project_id,
  status,
  min_score,
  intent,
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

  return request(`/leads?${params.toString()}`);
}

export async function updateLeadStatus({ lead_id, status }) {
  if (!lead_id) throw new Error("lead_id is required");
  if (!status) throw new Error("status is required");

  return request(`/leads/${lead_id}/status`, {
    method: "POST",
    body: JSON.stringify({ status })
  });
}


/* ================================
   AI API
================================ */

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
