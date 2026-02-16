const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await res.json();
  return data;
}

export function addSite(userId, url, plan = "gold") {
  return api("/v1/sites", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, url, plan })
  });
}

export function scanSite(siteId) {
  return api(`/v1/sites/${siteId}/scan`, {
    method: "POST"
  });
}

export function getLeads(siteId) {
  return api(`/v1/sites/${siteId}/leads`);
}

export function setLeadStatus() {
  return Promise.resolve();
}

export function trackEvent() {
  return Promise.resolve();
}
