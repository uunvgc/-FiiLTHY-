const API_BASE = "https://python-qvn2.onrender.com";

export async function addSite(url) {

  const res = await fetch(`${API_BASE}/sites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  return await res.json();
}

export async function scanSite(siteId) {

  const res = await fetch(`${API_BASE}/sites/${siteId}/scan`, {
    method: "POST",
  });

  return await res.json();
}

export async function getLeads(siteId) {

  const res = await fetch(`${API_BASE}/sites/${siteId}/leads`);

  return await res.json();
}
