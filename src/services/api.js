import axios from "axios";

// Your backend URL
const API_URL = "https://python-1-io1k.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Health check
export const getHealth = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

// Example checkout
export const createCheckout = async (data) => {
  const response = await api.post("/api/create-checkout", data);
  return response.data;
};

// Example lead generation
export const generateLeads = async (data) => {
  const response = await api.post("/api/generate-leads", data);
  return response.data;
};

export default api;
