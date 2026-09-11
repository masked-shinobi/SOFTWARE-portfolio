// =============================================================================
// Supabase Browser Client
// For use in Client Components ('use client')
// =============================================================================
// Uses createBrowserClient from @supabase/ssr for cookie-based auth handling.
// This client is safe to use in browser-side React components.
// =============================================================================

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

/**
 * Creates a Supabase client for use in browser/Client Components.
 *
 * Usage:
 * ```ts
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 * const supabase = createClient();
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
