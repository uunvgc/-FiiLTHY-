import axios from "axios";

// ✅ Your backend (Render)
const API_URL = "https://python-3-iy09.onrender.com";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Health check
export async function getHealth() {
  const res = await api.get("/");
  return res.data;
}

// Add site
export async function addSite(userId, url, plan = "gold") {
  const res = await api.post("/v1/sites", {
    url,
    name: url,      // backend expects name
    user_id: userId,
    plan,
  });
  return res.data;
}

// Scan site
export async function scanSite(siteId) {
  const res = await api.post(`/v1/sites/${siteId}/scan`);
  return res.data;
}

// Get leads
export async function getLeads(siteId) {
  const res = await api.get(`/v1/sites/${siteId}/leads`);
  return res.data;
}

export default api;
