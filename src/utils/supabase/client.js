import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pnylxveroxydqwzcdqqp.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_mHayAXKCyrVpKy9whmmkTA_V8jHnnsX";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
