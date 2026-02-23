import { supabase } from "./supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function apiFetch(path, init = {}) {
  const token = await getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    const err = new Error(json?.detail || json?.error || `API error ${res.status}`);
    err.status = res.status;
    err.detail = json;
    throw err;
  }

  return json;
}
