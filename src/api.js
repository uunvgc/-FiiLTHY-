const API_BASE = "https://python-3-iy09.onrender.com";

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
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(data?.detail || data?.raw || `HTTP ${res.status}`);
  }

  return data;
}

export function addSite(userId, url, plan = "gold") {
  // YOUR CURRENT BACKEND NEEDS: { url, name }
  return api("/v1/sites", {
    method: "POST",
    body: JSON.stringify({
      url,
      name: url
    })
  });
}

export function scanSite(siteId) {
  return api(`/v1/sites/${siteId}/scan`, { method: "POST" });
}

export function getLeads(siteId) {
  return api(`/v1/sites/${siteId}/leads`);
}

