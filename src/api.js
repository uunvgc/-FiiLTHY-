const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function addSite(userId, url, plan="gold") {
  const res = await fetch(`${API_BASE}/v1/sites`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user_id: userId, url, plan }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function scanSite(siteId) {
  const res = await fetch(`${API_BASE}/v1/sites/${siteId}/scan`, { method:"POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getLeads(siteId) {
  const res = await fetch(`${API_BASE}/v1/sites/${siteId}/leads`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function setLeadStatus(leadId, status) {
  const res = await fetch(`${API_BASE}/v1/leads/${leadId}/status?status=${status}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function trackEvent(userId, leadId, type, meta={}) {
  const res = await fetch(`${API_BASE}/v1/events`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user_id: userId, lead_id: leadId, type, meta }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
