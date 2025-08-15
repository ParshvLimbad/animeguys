
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabase(){
  if(!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try{ return createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }catch{ return null; }
}

export function getOpenRouterKey(){
  try{
    return (typeof window!=='undefined' && window.OPENROUTER_KEY) || process.env.NEXT_PUBLIC_OPENROUTER_KEY || "";
  }catch{ return process.env.NEXT_PUBLIC_OPENROUTER_KEY || ""; }
}
