import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const supabase = url && anon ? createClient(url, anon) : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
  return supabase;
}
