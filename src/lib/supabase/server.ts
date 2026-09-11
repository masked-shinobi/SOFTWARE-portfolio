// =============================================================================
// Supabase Server Client
// For use in Server Components, Route Handlers, Server Actions
// =============================================================================
// Uses createServerClient from @supabase/ssr with cookie handling.
// In Next.js App Router, cookies() is async and must be awaited.
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

/**
 * Creates a Supabase client for use in Server Components and Route Handlers.
 * Must be called within a server-side context (not in 'use client' components).
 *
 * Usage:
 * ```ts
 * // In a Server Component or Route Handler
 * import { createClient } from '@/lib/supabase/server';
 * const supabase = await createClient();
 * const { data } = await supabase.from('profile').select('*');
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component where
            // cookies can't be set. This is safe to ignore — the middleware
            // will refresh the session if needed.
          }
        },
      },
    }
  );
}
