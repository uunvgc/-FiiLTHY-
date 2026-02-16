const API_BASE = "https://python-3-iy09.onrender.com";

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
    body: JSON.stringify({
      user_id: userId,
      url: url,
      plan: plan
    })
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

export async function setLeadStatus(siteId, leadId, status) {
  const res = await fetch(
    `${API_BASE}/v1/sites/${siteId}/leads/${leadId}/status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }
  );

  return await res.json();
}

export function trackEvent(name, props = {}) {
  console.log("Event:", name, props);
  return Promise.resolve();
}
