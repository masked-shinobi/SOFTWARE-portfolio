// =============================================================================
// Data Access: Media
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database, Media, MediaType } from '@/types/database.types';

function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Fetches all media entries, ordered by creation date (newest first).
 */
export async function getMedia(
  client?: ReturnType<typeof createClient<Database>>
): Promise<Media[]> {
  const supabase = client ?? getSupabaseClient();

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getMedia] Error:', error.message);
    return [];
  }

  return (data ?? []) as Media[];
}

/**
 * Fetches media entries filtered by type ('image', 'video', or 'document').
 */
export async function getMediaByType(
  type: MediaType,
  client?: ReturnType<typeof createClient<Database>>
): Promise<Media[]> {
  const supabase = client ?? getSupabaseClient();

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`[getMediaByType] Error for type "${type}":`, error.message);
    return [];
  }

  return (data ?? []) as Media[];
}
