const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function addSite(userId, url, plan="gold") {

  const res = await fetch(`${API_BASE}/v1/sites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      url: url,
      plan: plan
    })
  });

  return await res.json();
}

export async function scanSite(siteId) {

  const res = await fetch(`${API_BASE}/v1/sites/${siteId}/scan`, {
    method: "POST"
  });

  return await res.json();
}

export async function getLeads(siteId) {

  const res = await fetch(`${API_BASE}/v1/sites/${siteId}/leads`);

  return await res.json();
}
