const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
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
  return api(`/v1/sites/${siteId}/scan`, { method: "POST" });
}

export function getLeads(siteId) {
  return api(`/v1/sites/${siteId}/leads`);
}

export function setLeadStatus(siteId, leadId, status) {
  return api(`/v1/sites/${siteId}/leads/${leadId}/status`, {
    method: "POST",
    body: JSON.stringify({ status })
  });
}

export function trackEvent(name, props = {}) {
  console.log("Event:", name, props);
  return Promise.resolve();
}
