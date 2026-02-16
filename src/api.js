// src/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Core API helper
 */
async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await res.text();

  let data;
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

/**
 * Create a new site
 */
export async function addSite(userId, url, plan = "gold") {
  return api("/v1/sites", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      url: url,
      plan: plan
    })
  });
}

/**
 * Run FIILTHY scan engine
 */
export async function scanSite(siteId) {
  return api(`/v1/sites/${siteId}/scan`, {
    method: "POST"
  });
}

/**
 * Get generated leads
 */
export async function getLeads(siteId) {
  return api(`/v1/sites/${siteId}/leads`);
}

/**
 * Update lead status (stubbed — safe for now)
 */
export async function setLeadStatus(siteId, leadId, status) {
  console.log("setLeadStatus:", siteId, leadId, status);

  return {
    success: true,
    site_id: siteId,
    lead_id: leadId,
    status: status
  };
}

/**
 * Track events (stubbed analytics)
 */
export async function trackEvent(eventName, props = {}) {
  console.log("trackEvent:", eventName, props);

  return {
    success: true
  };
}
