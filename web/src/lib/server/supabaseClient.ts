import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_KEY } from "$env/static/private";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_KEY);
