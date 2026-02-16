// src/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
  }

  return data;
}

export function addSite(userId, url, plan = "gold") {
  return api("/v1/sites", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, url, plan }),
  });
}

export function scanSite(siteId) {
  return api(`/v1/sites/${siteId}/scan`, { method: "POST" });
}

export function getLeads(siteId) {
  return api(`/v1/sites/${siteId}/leads`);
}

/** ✅ REQUIRED so your build succeeds */
export function setLeadStatus(siteId, leadId, status) {
  // backend route not implemented yet — this is a safe stub
  return Promise.resolve({ ok: true, site_id: siteId, lead_id: leadId, status });
}

/** ✅ REQUIRED so your build succeeds */
export function trackEvent(name, props = {}) {
  // optional stub
  console.log("[trackEvent]", name, props);
  return Promise.resolve({ ok: true });
}
