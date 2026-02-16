// FIILTHY API — FULL WORKING

const API_BASE = "https://python-3-iy09.onrender.com";

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }

  if (!res.ok) {
    throw new Error(data.detail || data.error || "API error");
  }

  return data;
}

export async function addSite(userId, url, plan = "gold") {
  return await api("/v1/sites", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      url: url,
      plan: plan
    })
  });
}

export async function scanSite(siteId) {
  return await api(`/v1/sites/${siteId}/scan`, {
    method: "POST"
  });
}

export async function getLeads(siteId) {
  return await api(`/v1/sites/${siteId}/leads`);
}

export async function setLeadStatus(siteId, leadId, status) {
  return await api(`/v1/sites/${siteId}/leads/${leadId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: status
    })
  });
}

export function trackEvent(name, props = {}) {
  console.log("Event:", name, props);
}
