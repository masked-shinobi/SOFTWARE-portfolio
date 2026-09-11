// =============================================================================
// Data Access: Profile
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database, Profile } from '@/types/database.types';

// ---------------------------------------------------------------------------
// Standalone client for scripts and non-Next.js contexts.
// In the Next.js app, the server/client modules in lib/supabase/ should be
// used instead. This function is here so the data layer can also be tested
// outside of Next.js (e.g., via the verification script).
// ---------------------------------------------------------------------------
function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Fetches the single portfolio owner profile.
 * Returns null if no profile row exists.
 *
 * @param client - Optional Supabase client (pass one from server.ts / client.ts
 *                 when calling from Next.js). Falls back to a standalone client.
 */
export async function getProfile(
  client?: ReturnType<typeof createClient<Database>>
): Promise<Profile | null> {
  const supabase = client ?? getSupabaseClient();

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('[getProfile] Error:', error.message);
    return null;
  }

  return data as Profile;
}
