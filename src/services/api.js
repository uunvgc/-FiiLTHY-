import axios from "axios";

// ============================================
// FIILTHY BACKEND URL (Render)
// ============================================
const API_URL = "https://python-3-iy09.onrender.com";

// ============================================
// Axios instance
// ============================================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// HEALTH CHECK
// ============================================
export async function getHealth() {
  const res = await api.get("/");
  return res.data;
}

// ============================================
// ADD SITE
// ============================================
export async function addSite(userId, url, plan = "gold") {
  const res = await api.post("/v1/sites", {
    url: url,
    name: url,
    user_id: userId,
    plan: plan,
  });

  return res.data;
}

// ============================================
// SCAN SITE
// ============================================
export async function scanSite(siteId) {
  const res = await api.post(`/v1/sites/${siteId}/scan`);
  return res.data;
}

// ============================================
// GET LEADS
// ============================================
export async function getLeads(siteId) {
  const res = await api.get(`/v1/sites/${siteId}/leads`);
  return res.data;
}

// ============================================
// EXPORT DEFAULT
// ============================================
export default api;
